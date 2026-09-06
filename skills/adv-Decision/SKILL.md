---
name: adv-Decision
user-invocable: true
argument-hint: "<the decision you are facing — a choice, a bet, a fork, a 'should I…'>"
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Workflow
model: opus
effort: high
description: |
  Council orchestrator for hard decisions. Runs 5 parallel lens-advisors plus 3
  structural roles, adversarially cross-verifies their verdicts, then a validator
  with a Kahneman & Klein environment-validity ROUTER weights the lenses and
  produces a single Markdown verdict — final decision, WHY this and not the
  alternatives, per-advisor verdict + confidence + citations, consensus map,
  SWOT, pre-mortem, and foreseen-vs-blind-spots. Gated by a satisfice check so
  low-stakes decisions get a 2-minute answer instead of the full council.
  5 lenses: advisor-probabilistic (judgment under uncertainty),
  advisor-process (decision method), advisor-CognitiveBiases (judgment quality),
  advisor-systems (structure & feedback loops), advisor-convex (convexity, ruin,
  skin-in-the-game). Memory = an append-only decision journal in the memory folder
  you point the plugin at when you install it.
  Invoke via /advisors:adv-Decision followed by the decision.
  English triggers: how should I decide, decision council, hard decision,
  should I, which option, big bet, irreversible choice, decision audit,
  pre-mortem, weigh options, tradeoff, is this a good decision, fork in the road,
  high-stakes choice, advisor council, council of advisors.
  Russian triggers: как мне решить, совет по решению, трудное решение, стоит ли,
  какой вариант выбрать, большая ставка, необратимый выбор, аудит решения,
  предмортем, взвесить варианты, развилка, дилемма, совет советников,
  принять решение, помоги решить.
---

# Decision Council — гибрид Skill + Workflow

The expensive, deterministic core (5 lenses + 2 roles → cross-verification ledger)
runs as the **`council-decision-core`** workflow. The decision-quality logic the user
keeps under direct control — the **satisfice gate**, the **K&K router synthesis**, and
the **append-only decision journal** — stays in this skill. The satisfice gate runs
*before* the workflow (it can cancel the council); the router + journal run *after*,
on what the workflow returns.

## Constants

```
PLUGIN_ROOT = ${CLAUDE_PLUGIN_ROOT}
MEMORY_DIR  = ${user_config.ADVISORS_MEMORY_DIR}
OUTPUT_DIR  = {MEMORY_DIR}/Вердикты/Решения
JOURNAL     = {MEMORY_DIR}/Журнал решений.md
RUN_LOG     = {MEMORY_DIR}/Журнал советов.md
WORK_DIR    = {MEMORY_DIR}/_runs/decision-{QUERY_SLUG}
```

Inside protocols, lenses and shared contracts the paths are written as the placeholders
`{PLUGIN_ROOT}` and `{MEMORY_DIR}`: `${CLAUDE_PLUGIN_ROOT}` and `${user_config.*}` are NOT
expanded inside files you Read. Substitute the values yourself; never send a literal
`{PLUGIN_ROOT}` to Read.

## Phase 0.0 — memory gate (runs first, every time)

1. `MEMORY_DIR` empty, or the literal text `${user_config` is visible in it → **stop**:
   > No memory folder configured. Open `/plugin` → advisors → settings and set
   > `ADVISORS_MEMORY_DIR` (e.g. `~/advisors-memory`), or reinstall with
   > `--config ADVISORS_MEMORY_DIR=<path>`. The council will not write verdicts into the
   > current working directory.
2. Path starts with `~/` → replace `~` with `$HOME` **before any write**.
3. Unpack the skeleton — idempotent, never overwrites existing files; if the folder is
   created for the first time, say so and list what appeared in it:
   ```bash
   bash "${CLAUDE_PLUGIN_ROOT}/scripts/init-memory.sh" "{MEMORY_DIR}" "${CLAUDE_PLUGIN_ROOT}"
   ```
4. `mkdir -p "{OUTPUT_DIR}"` — this council's verdict subfolder.
5. Nothing in this skill writes outside `{MEMORY_DIR}`. A path computed outside it is a
   defect — stop and say so.

## Architecture

```
Phase 0 (memory) → Phase 1.5 (SATISFICE GATE — may short-circuit)
  → Phase B (Workflow council-decision-core: fan-out + ledger)
  → Phase C (ROUTER synthesis + journal, in this session)
```

## Phase 0 — Validation + Memory Load

1. If `$ARGUMENTS` is empty → AskUserQuestion: "What decision are you facing? State it
   as a choice or a 'should I…' question." Else `RAW_QUERY = $ARGUMENTS`.
2. Read `{JOURNAL}` if it exists. Use prior entries
   (stakes profile, calibration, open revisit dates) to enrich context. If an entry is
   **due for revisit**, surface it and offer to score the prior prediction.

## Phase 1.5 — SATISFICE GATE (cheap-path check — stays in skill)

**Run before any council machinery.** Read `protocols/structural-roles.md` → "Satisfice
Gate". Classify the decision on three axes — **Stakes**, **Reversibility**, **Information
value**:

- **All three cheap-path → SATISFICE. Do NOT invoke the workflow.** Give the 2-minute
  answer: state the "good enough" bar, pick the first option clearing it (do not optimize),
  name one tripwire to revisit, stop. Tell the user: "Satisfice-grade decision; maximizing
  it costs more than it returns (Schwartz). Council not run." **End here.**
- **Any axis hits the council signal → COUNCIL.** Proceed to Phase 2; tell the user in one
  line which axis cleared the gate.
- **Ambiguous → AskUserQuestion** with the three axes, then re-decide.

## Phase 2 — Preparation + SCOPE

Assemble for the workflow:
- `USER_CONTEXT` (pre-interview) — options (always include status-quo), objective, reversibility,
  worst case, feedback timeline + whether the environment is learnable (feeds the router), who
  bears the downside, any relevant prior journal entry. Gaps here become interview questions
  in Phase 2.5.
- `QUERY_SLUG` (lowercase, special→hyphen, ≤50) — used ONLY for `WORK_DIR`.
- `FILE_NAME` — verdict file name: a short **Russian** title of the decision topic
  (3–7 words), none of `/ \ : # ^ [ ] |`. Before writing check for a name collision with
  `ls "{OUTPUT_DIR}"`; name taken → append " (2)".
- `OUTPUT_DIR` and `WORK_DIR` — from Constants. `mkdir -p "{OUTPUT_DIR}" "{WORK_DIR}"`.
  Run artefacts stay inside `{MEMORY_DIR}/_runs/` and are deleted in Phase C.
- `lenses` — the 5 lens objects (absolute `skillPath`, no `~`). Preflight each:
  `test -d "{skillPath}/references"`; missing → drop with a warning (note for the denominator).

### Lens roster

| slug | lensName | skillPath |
|------|----------|-----------|
| probabilistic | Judgment-under-uncertainty lens | `${CLAUDE_PLUGIN_ROOT}/lenses/advisor-probabilistic` |
| process | Decision-process lens | `${CLAUDE_PLUGIN_ROOT}/lenses/advisor-process` |
| CognitiveBiases | Judgment-quality / reasoning-audit lens | `${CLAUDE_PLUGIN_ROOT}/lenses/advisor-CognitiveBiases` |
| systems | Systems-thinking lens | `${CLAUDE_PLUGIN_ROOT}/lenses/advisor-systems` |
| convex | Convexity / ruin / skin-in-the-game lens | `${CLAUDE_PLUGIN_ROOT}/lenses/advisor-convex` |

Roles (`devils-advocate`, `outside-view`) are built into the workflow — no resolution needed.

## Phase 2.5 — INTERVIEW (mandatory on the COUNCIL branch)

Follow `${CLAUDE_PLUGIN_ROOT}/shared/council-interview-protocol.md` (Read on demand — the file
is NOT preloaded). Decision-specific notes:

- **Batch 1 = static base questions** (only those not already answered by the query/journal):
  the options on the table incl. "do nothing"; the real objective; reversibility + worst-case
  downside; feedback timeline / learnability.
- **Batch 2 = harvest clusters.** Run
  `Workflow(scriptPath:"${CLAUDE_PLUGIN_ROOT}/workflows/council-question-harvest.js",
  args:{query: RAW_QUERY, userContext: <pre-interview USER_CONTEXT>,
  roster: lenses→{slug, name: lensName, skillPath}, councilType: "decision",
  maxQuestionsPerAdvisor: 3, workDir: WORK_DIR, pluginRoot: PLUGIN_ROOT})`,
  wait for the task-notification, filter
  clusters against what is already known, ask via AskUserQuestion (≤8 questions total across
  both batches).
- Outputs: `REFINED_QUERY` = RAW_QUERY sharpened by the answers;
  `USER_CONTEXT` = pre-interview context + CONTEXT_DOSSIER (dossier appended last).
- Empty/failed harvest → proceed with static questions only (degradation table in the protocol).

## Phase B — INVOKE

```
Workflow({
  scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/council-decision-core.js",
  args: {
    refinedQuery: REFINED_QUERY,
    userContext: USER_CONTEXT,
    lenses: <the {slug, lensName, skillPath} array from Phase 2, minus the dropped ones>,
    workDir: WORK_DIR,
    pluginRoot: PLUGIN_ROOT   // ${CLAUDE_PLUGIN_ROOT} is NOT expanded inside JS — pass by value
  }
})
```

The workflow runs the 5 lenses + 2 roles **independently** (Noise decision-hygiene), then
produces the **cross-verification ledger** (evidence / cross-lens / pre-mortem challenges →
SUPPORTED / CONTESTED / WEAK / REFUTED). It does NOT run the router. Wait for the
`<task-notification>`, then use the returned object:
`{workDir, status, lensesAnswered, lenses, roles:{devilsAdvocate, outsideView}, claimLedger, ledgerNotes}`.
Progress is visible in `/workflows`.

## Phase C — ROUTER synthesis + Journal (this session)

Read artifacts from `WORK_DIR` (file-mediated). Then **you** run the K&K router — do not
delegate it; this is the decision-quality core.

- **`status: "low-quorum"`** (<4 lenses): show available `{WORK_DIR}/lens-*.md` directly with
  the warning "Only {N}/5 lenses responded. Showing available verdicts without full synthesis."
  Still surface the pre-mortem kill-shot and the base rate from the role files.
- **`status: "ok"`** — run the **ROUTER**:
  1. Read `protocols/validator-protocol.md` (the K&K router spec) + all `{WORK_DIR}/lens-*.md`
     + `{WORK_DIR}/role-devils-advocate.md` + `{WORK_DIR}/role-outside-view.md`. Use the
     returned `claimLedger` (never treat a WEAK/REFUTED claim as consensus).
  2. Classify the environment (HIGH-validity+fast-feedback vs LOW-validity+delayed); weight each
     lens by **RouterFit×3 + EvidenceTier×2 + CrossVerify×2 + Relevance×1) / 8** — NOT by
     self-confidence. Keep CognitiveBiases on regardless; **convex's ruin screen is
     lexicographic** (a non-trivial path to unrecoverable loss overrides EV and vote count).
  3. Write the verdict via Write to `{OUTPUT_DIR}/{FILE_NAME}.md` in the validator-protocol
     format (YAML frontmatter; Final decision; Why this — not the alternatives; What to do;
     Pre-mortem; Arguments; SWOT; Consensus map with a Ledger column; Per-advisor verdicts;
     Foreseen vs blind spots; Predicted outcomes; Revisit). Populate "Residual blind spots"
     from the CONTEXT_DOSSIER zones «Неизвестно» and «Не спрошено» (interview, Phase 2.5).
     Show it in full.
  4. `rm -rf "{WORK_DIR}"`.
  5. Post-write (contract `${CLAUDE_PLUGIN_ROOT}/shared/memory-write-contract.md`): append one
     line to `{RUN_LOG}` — `- YYYY-MM-DD · adv-Decision · {FILE_NAME} — {one-line outcome}`.
     If `{MEMORY_DIR}` happens to live inside an Obsidian vault, a wikilink to the verdict can
     be added by hand; the skill itself calls no external CLI.

### Decision-Journal Append (memory — append-only, stays in skill)

Append to `{JOURNAL}` (create if missing — **never overwrite** prior entries). For this decision record: `date`, `decision` (one line), `chosen_option`,
`predicted_outcomes` (the bet, memorialized now), `environment_class` (the K&K verdict),
`revisit` = three computed dates **+3mo / +6mo / +12mo** (compute via Bash `date`),
`key_citations`. The journal is private: keep `{MEMORY_DIR}` out of any public repository.

Entry format:

```markdown
## YYYY-MM-DD — {short decision title}

- **Decision:** {one line}
- **Chosen:** {option chosen, and the alternatives rejected}
- **Environment:** high-validity+fast-feedback | low-validity+delayed-feedback
- **Predicted outcomes (the bet):** {outcome A}: ~{P}% · {outcome B}: ~{P}%
- **Pre-mortem kill-shot:** {the single most likely failure mode foreseen}
- **Revisit:** 3mo → {date} · 6mo → {date} · 12mo → {date}
- **Citations:** [PREFIX:CODE], [PREFIX:CODE]
- **Outcome (filled in at revisit):** _pending_
```

File header (only when creating the journal): `profile.default_revisit: ["3mo","6mo","12mo"]`
and `updated: YYYY-MM-DD` in frontmatter. On a revisit-due entry, ask the user to score the
prediction — was the *decision* good, independent of the *outcome* — and fill `Outcome`.

## Key Principles

1. **Satisfice before you maximize.** The gate is not optional; it runs before the workflow.
2. **Independence before aggregation** — the workflow runs lenses in parallel, no cross-talk.
3. **Weight by environment, then by evidence — never by confidence alone** (router, in skill).
4. **Ruin is lexicographically first** (convex screen overrides router + vote count).
5. **Memorialize the bet** — journal predicted probabilities + revisit dates before the outcome.
6. **Citations mandatory** — every recommendation carries a `[PREFIX:CODE]` tag.

## Response Language

Response language = the user's language. Citation tags stay in English.
