export const meta = {
  name: 'council-decision-core',
  description: 'Ядро Decision Council: 5 линз + 2 структурные роли (независимо) → cross-verification ledger. Router (K&K) и журнал — в скилле.',
  phases: [
    { title: 'Fan-out', detail: '5 линз + devils-advocate + outside-view, независимо, параллельно' },
    { title: 'Cross-verify', detail: 'ledger: evidence / cross-lens / pre-mortem challenges → SUPPORTED/CONTESTED/WEAK/REFUTED' },
  ],
}

// ── Параметры (skill передаёт после satisfice-гейта; дефолты — для dry-run) ──
// args может прийти JSON-строкой (харнесс не парсит нетипизированный параметр) — шим как в full-research-core.js
const A = (() => { try { return typeof args === 'string' ? JSON.parse(args) : (args || {}) } catch (e) { return {} } })()
// Корень плагина: ${CLAUDE_PLUGIN_ROOT} в JS не подставляется — скилл передаёт значением.
const PLUGIN_ROOT = A.pluginRoot || '.'
const QUERY = A.refinedQuery || 'Стоит ли уходить из найма, чтобы делать свой продукт фултайм?'
const USER_CONTEXT = A.userContext || 'Контекст не задан (dry-run). Включи статус-кво «ничего не делать».'
const WORK_DIR = A.workDir || 'adv-decision/.tmp-council-dryrun'
const QUORUM = 4 // <4 линз → low-quorum (skill покажет вердикты без полного router-синтеза)

// Воркер: пиннинг Opus 5 + effort high через субагента advisor-opus.
// Реестр агентов кэшируется на старте сессии — если субагент создан в текущей сессии,
// оркестратор может передать workerOpts: { model: 'opus' } как фоллбэк.
const WORKER_OPTS = A.workerOpts || { agentType: 'advisors:advisor-opus' }
const w = extra => Object.assign({}, WORKER_OPTS, extra)

const DEFAULT_LENSES = [
  { slug: 'probabilistic', lensName: 'Judgment-under-uncertainty lens', skillPath: `${PLUGIN_ROOT}/lenses/advisor-probabilistic` },
  { slug: 'process', lensName: 'Decision-process lens', skillPath: `${PLUGIN_ROOT}/lenses/advisor-process` },
  { slug: 'CognitiveBiases', lensName: 'Judgment-quality / reasoning-audit lens', skillPath: `${PLUGIN_ROOT}/lenses/advisor-CognitiveBiases` },
  { slug: 'systems', lensName: 'Systems-thinking lens', skillPath: `${PLUGIN_ROOT}/lenses/advisor-systems` },
  { slug: 'convex', lensName: 'Convexity / ruin / skin-in-the-game lens', skillPath: `${PLUGIN_ROOT}/lenses/advisor-convex` },
]
const LENSES = (Array.isArray(A.lenses) && A.lenses.length) ? A.lenses : DEFAULT_LENSES

// ── Схемы ──
const LENS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    slug: { type: 'string' },
    verdict: { type: 'string', description: '1-2 предложения: одно-строчный вердикт линзы' },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          move: { type: 'string' },
          tag: { type: 'string', description: '[PREFIX:CODE]' },
          tier: { type: 'string', enum: ['T1', 'T2', 'T3'], description: 'T1 base-rate/механизм, T2 cited principle, T3 эвристика' },
        },
        required: ['move', 'tag', 'tier'],
      },
    },
    confidence: { type: 'string', enum: ['HIGH', 'MED', 'LOW'] },
    environmentRead: {
      type: 'object',
      additionalProperties: false,
      properties: {
        learnable: { type: 'string', enum: ['learnable', 'low-validity', 'mixed'], description: 'регулярная среда с обратной связью vs опаковая/отложенная' },
        patternBank: { type: 'string', description: 'есть ли у решающего реальная экспертиза здесь, или это ново' },
      },
      required: ['learnable', 'patternBank'],
    },
    whatItSees: { type: 'string' },
    whatItIsBlindTo: { type: 'string' },
    fileWritten: { type: 'string' },
  },
  required: ['slug', 'verdict', 'recommendations', 'confidence', 'environmentRead', 'whatItSees', 'whatItIsBlindTo', 'fileWritten'],
}

const DEVILS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    killshot: { type: 'string', description: 'самый вероятный режим отказа' },
    killshotProbability: { type: 'string', description: 'грубая вероятность, напр. ~35%' },
    linchpins: { type: 'array', items: { type: 'string' }, description: 'допущения, ложность которых топит решение' },
    blindSpots: { type: 'array', items: { type: 'string' } },
    fileWritten: { type: 'string' },
  },
  required: ['killshot', 'killshotProbability', 'linchpins', 'blindSpots', 'fileWritten'],
}

const OUTSIDE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    referenceClass: { type: 'string' },
    baseRate: { type: 'string', description: 'X% / диапазон достижения цели в этом классе' },
    adjustments: { type: 'array', items: { type: 'string' }, description: 'факторы up/down с обоснованием' },
    adjustedEstimate: { type: 'string', description: 'P% диапазон + confidence' },
    fileWritten: { type: 'string' },
  },
  required: ['referenceClass', 'baseRate', 'adjustments', 'adjustedEstimate', 'fileWritten'],
}

const LEDGER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    claims: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          statement: { type: 'string', description: 'claim/рекомендация в одну фразу' },
          lens: { type: 'string', description: 'какая линза выдвинула' },
          evidenceTier: { type: 'string', enum: ['T1', 'T2', 'T3', 'none'] },
          verdict: { type: 'string', enum: ['SUPPORTED', 'CONTESTED', 'WEAK', 'REFUTED'] },
          reason: { type: 'string', description: 'одна фраза: какой из 3 challenges сработал' },
          contestedWith: { type: 'string', description: 'если CONTESTED — с какой линзой конфликт (иначе пусто)' },
        },
        required: ['id', 'statement', 'lens', 'evidenceTier', 'verdict', 'reason', 'contestedWith'],
      },
    },
    notes: { type: 'string', description: 'краткая сводка: что прошло, что отсеяно' },
  },
  required: ['claims', 'notes'],
}

// ── Промпт линзы (порт protocols/advisor-prompt.md, decision) ──
function lensPrompt(l) {
  return `You are the **${l.lensName}** of a decision council. You read this decision through ONE lens and no other. You are deliberately one-sided — the validator integrates lenses later.

## The decision
${QUERY}

## Context
${USER_CONTEXT}

## Instructions
1. Read \`${l.skillPath}/SKILL.md\` (Read tool, absolute path) — your operating manual.
2. Following its Reference Navigation, load AT MOST 2 reference files from \`${l.skillPath}/references/\` chosen by the decision's dominant question. Precision over volume.
3. Run your lens's analysis protocol. Render an INDEPENDENT verdict — you are blind to the other advisors (Noise decision-hygiene).

## Rules
- Answer ONLY through your own lens. Every recommendation carries a citation tag [PREFIX:CODE].
- Be honest about confidence and about what your lens CANNOT see.
- Do NOT spawn sub-agents. Do NOT invoke skills. Response language = the decision's language.

## Confidence + Evidence Tier (REQUIRED — the router weights on these)
- Confidence — HIGH/MED/LOW (how well this decision falls in your lens's domain).
- Evidence tier per recommendation: T1 base-rate/mechanism, T2 cited principle (case data thin), T3 heuristic/judgment.

## Environment read (feeds the K&K router)
- Is the environment learnable (regular, fast/clear feedback) or low-validity (irregular, opaque, delayed/noisy)?
- Does the decider have a real pattern bank here (expertise) or is this novel?

## Save
Write via Write to \`${WORK_DIR}/lens-${l.slug}.md\` with this format:
# ${l.lensName} — verdict
## Verdict
## Recommendation (each: move [PREFIX:CODE] — tier T1/T2/T3)
## Confidence: HIGH/MED/LOW
## Environment read (for the router)
## What this lens sees
## What this lens is blind to

After writing, return the structured summary (schema): slug="${l.slug}", verdict, recommendations[], confidence, environmentRead{learnable,patternBank}, whatItSees, whatItIsBlindTo, fileWritten="${WORK_DIR}/lens-${l.slug}.md".
If references are unavailable — still give the verdict from SKILL.md and note it.`
}

// ── Промпт devils-advocate (порт structural-roles.md) ──
function devilsPrompt() {
  return `You are the DEVIL'S ADVOCATE and PRE-MORTEM officer of a decision council. Your only job is to make the strongest possible case that the leading choice FAILS. You do not balance; you attack.

## The decision
${QUERY}
## Context
${USER_CONTEXT}

## Instructions
1. Run a PRE-MORTEM (Klein): assume it is 6–18 months later and this decision clearly failed. Write the post-mortem as fact, then reverse-engineer the most plausible causes.
2. For grounding you MAY read AT MOST ONE reference file:
   - ${PLUGIN_ROOT}/lenses/advisor-convex/references/klein-sources-of-power.md → cite [SOP:CODE]
   - ${PLUGIN_ROOT}/lenses/advisor-CognitiveBiases/references/galef-scout-mindset.md or munger-human-misjudgment.md → cite [SCT:CODE]/[PHM:CODE]
3. Identify the single most likely KILL-SHOT and rate its rough probability.
4. List linchpin assumptions (false → decision sinks).
5. Name what the decider is NOT looking at because they want this to be right.

## Rules
- Attack the leading option specifically; generic risks are weak. Cite tags where used; pure attack reasoning may be labeled "(unsupported assertion)".
- Do NOT spawn sub-agents. Do NOT invoke skills. Response language = the decision's language.

## Save
Write via Write to \`${WORK_DIR}/role-devils-advocate.md\` (format: # Devil's Advocate / Pre-Mortem; ## The failure; ## Kill-shot; ## Linchpin assumptions; ## Blind spots; ## Citations).
After writing, return the schema: killshot, killshotProbability, linchpins[], blindSpots[], fileWritten="${WORK_DIR}/role-devils-advocate.md".`
}

// ── Промпт outside-view (порт structural-roles.md) ──
function outsidePrompt() {
  return `You are the OUTSIDE-VIEW / BASE-RATE officer of a decision council. Your only job is to find the reference class and state the base rate BEFORE anyone tells a story about why this case is different.

## The decision
${QUERY}
## Context
${USER_CONTEXT}

## Instructions
1. Define the REFERENCE CLASS: the broad category of bet this belongs to.
2. State the BASE RATE for that class (number or range). If you must estimate, say so and Fermi-ize.
3. For grounding you MAY read AT MOST ONE reference file:
   - ${PLUGIN_ROOT}/lenses/advisor-probabilistic/references/tetlock-superforecasting.md → cite [SF:CODE]
   - ${PLUGIN_ROOT}/lenses/advisor-probabilistic/references/duke-thinking-in-bets.md → cite [TIB:CODE]
4. ONLY AFTER the base rate, list case-specific factors that justify adjusting up/down — and by how much. Resist large adjustments without strong evidence.
5. Give the adjusted estimate as a probability range.

## Rules
- Base rate FIRST, story SECOND. Cite tags for any principle used.
- Do NOT spawn sub-agents. Do NOT invoke skills. Response language = the decision's language.

## Save
Write via Write to \`${WORK_DIR}/role-outside-view.md\` (format: # Outside View / Base-Rate; ## Reference class; ## Base rate; ## Case-specific adjustments; ## Adjusted estimate; ## Citations).
After writing, return the schema: referenceClass, baseRate, adjustments[], adjustedEstimate, fileWritten="${WORK_DIR}/role-outside-view.md".`
}

// ── Промпт ledger-агента (кросс-верификация вердиктов до синтеза) ──
function ledgerPrompt(lensFiles, roleFiles) {
  return `You are the CROSS-VERIFICATION officer of a decision council. Independent verdicts were written; challenge them BEFORE synthesis. Do NOT let weak claims pass unflagged.

## The decision
${QUERY}
## Context
${USER_CONTEXT}

## Files to read (Read each)
Lens verdicts:
${lensFiles.map(f => `- ${f}`).join('\n')}
Structural roles:
${roleFiles.map(f => `- ${f}`).join('\n')}

## Procedure
For EACH claim/recommendation across the lens verdicts, test three challenges:
1. EVIDENCE challenge — backed by a citation [PREFIX:CODE], a base rate, or a concrete mechanism? Or assertion/vibe? Unbacked → WEAK.
2. CROSS-LENS challenge — does another lens directly contradict it? Record the contested pair (set contestedWith).
3. PRE-MORTEM challenge — does role-devils-advocate already name a failure mode that refutes it? If so it must answer or be downgraded → REFUTED.

Assign per claim: SUPPORTED / CONTESTED / WEAK / REFUTED, with a one-line reason naming which challenge fired, and the evidence tier (T1/T2/T3/none).
REFUTED claims will be dropped from the final "what to do"; CONTESTED surface in arguments/consensus map. Be strict — a confident but unbacked claim is WEAK, not SUPPORTED.

Do NOT spawn sub-agents. Do NOT invoke skills. Read ONLY the files above. Response language = the decision's language.
Return strictly per schema (claims[] + notes). Do NOT run the K&K router or write a verdict — that is the orchestrator's job.`
}

// ═══ Phase 1 — Fan-out (5 lenses + 2 roles, independent) ═══
phase('Fan-out')
log(`Запускаю ${LENSES.length} линз + 2 структурные роли (независимо)...`)

// Единый parallel() для всех 7 агентов — уважает cap конкурентности workflow.
const fanout = await parallel([
  ...LENSES.map(l => () => agent(lensPrompt(l), w({ label: `lens:${l.slug}`, phase: 'Fan-out', schema: LENS_SCHEMA }))),
  () => agent(devilsPrompt(), w({ label: 'role:devils-advocate', phase: 'Fan-out', schema: DEVILS_SCHEMA })),
  () => agent(outsidePrompt(), w({ label: 'role:outside-view', phase: 'Fan-out', schema: OUTSIDE_SCHEMA })),
])
const lensResults = fanout.slice(0, LENSES.length)
const devils = fanout[LENSES.length] || null
const outside = fanout[LENSES.length + 1] || null

const lenses = lensResults.filter(Boolean)
const lensFiles = lenses.map(r => r.fileWritten).filter(Boolean)
const roleFiles = [devils, outside].filter(Boolean).map(r => r.fileWritten).filter(Boolean)
log(`Линз ответило: ${lenses.length}/${LENSES.length} · роли: ${roleFiles.length}/2`)

const status = lenses.length >= QUORUM ? 'ok' : 'low-quorum'

// ═══ Phase 2 — Cross-verify (ledger) ═══
phase('Cross-verify')

let claimLedger = []
let ledgerNotes = ''
if (lenses.length >= 1) {
  const ledger = await agent(ledgerPrompt(lensFiles, roleFiles), w({ label: 'cross-verify-ledger', phase: 'Cross-verify', schema: LEDGER_SCHEMA }))
  claimLedger = ledger.claims || []
  ledgerNotes = ledger.notes || ''
  const tally = claimLedger.reduce((m, c) => { m[c.verdict] = (m[c.verdict] || 0) + 1; return m }, {})
  log(`Ledger: ${Object.entries(tally).map(([k, v]) => `${k}=${v}`).join(', ') || '(пусто)'}`)
} else {
  log('Ни одна линза не ответила — ledger пропущен.')
}

// Router (K&K) и журнал НЕ здесь — их выполняет скилл по этим данным.
return {
  workDir: WORK_DIR,
  status,
  lensesAnswered: lenses.length,
  lensesExpected: LENSES.length,
  files: { lenses: lensFiles, roles: roleFiles },
  lenses,
  roles: { devilsAdvocate: devils || null, outsideView: outside || null },
  claimLedger,
  ledgerNotes,
}
