# Structural Roles

Three roles that are not "books" but decision-hygiene functions. They are what keep
the council from becoming a confident echo chamber: a gate that stops it running at
all when it shouldn't, a mandatory failure-hunter, and a base-rate anchor.

- **Satisfice gate** — runs FIRST (Phase 1.5), in the orchestrator itself. It can
  short-circuit the entire council.
- **Devil's advocate / pre-mortem** — runs as an Agent in Phase 3 (mandatory).
- **Outside view / base-rate** — runs as an Agent in Phase 3.

---

## 1. Satisfice Gate (Phase 1.5 — orchestrator runs this directly, no agent)

**Source idea:** Schwartz, *The Paradox of Choice* — maximizing every choice is a
cost, not a virtue; for most decisions a "good enough" pick beats an optimal one
once you price in the deliberation. Simon's *satisficing*: search until an option
clears an aspiration bar, then stop.

**Why it is first:** the council is expensive (7 agents + a validator). Spending it
on a reversible, low-stakes choice is itself a decision error — analysis-paralysis
dressed up as rigor. The gate is the cheap path.

### Classify the decision on three axes

| Axis | Cheap-path signal | Council signal |
|------|-------------------|----------------|
| **Stakes** | Recoverable annoyance; bounded, affordable loss | Unrecoverable, ruinous, or life/career-shaping |
| **Reversibility** | Two-way door — you can undo it cheaply | One-way door — hard or impossible to reverse |
| **Information value** | More analysis won't change the pick | Real uncertainty that analysis could resolve |

### Gate decision

- **All three are cheap-path → SATISFICE. Do not run the council.** Return a
  2-minute answer:
  1. State the "good enough" bar (the minimum the option must clear).
  2. Pick the first option that clears it — explicitly do not optimize.
  3. Name **one tripwire** that would make you revisit (a condition, a date, a number).
  4. Stop. Tell the user: "This is a satisfice-grade decision; maximizing it costs
     more than it returns (Schwartz). Council not run."
- **Any axis hits the council signal → COUNCIL.** Proceed to Phase 2. Tell the user
  in one line which axis cleared the gate (e.g. "Irreversible + high-stakes →
  full council").
- **Ambiguous → AskUserQuestion** presenting the three axes, then re-decide.

The gate's classification is also recorded in the verdict (it explains *why* the
council was warranted) and in the decision journal.

---

## 2. Devil's Advocate / Pre-Mortem (Phase 3 Agent — MANDATORY)

This role is not optional. Even when every lens agrees, the pre-mortem runs. Its job
is to manufacture the dissent that consensus suppresses.

### Agent prompt

```
You are the DEVIL'S ADVOCATE and PRE-MORTEM officer of a decision council. Your only
job is to make the strongest possible case that the leading choice FAILS. You do not
balance; you attack. The council has other roles for the upside.

## The decision
{REFINED_QUERY}

## Context
{USER_CONTEXT}

## Instructions
1. Run a PRE-MORTEM (Klein): assume it is 6–18 months later and this decision has
   clearly failed. Write the post-mortem. Do not hedge — assert the failure as fact,
   then reverse-engineer the most plausible causes.
2. For grounding you MAY read at most ONE reference file from either:
   - {PLUGIN_ROOT}/lenses/advisor-convex/references/klein-sources-of-power.md (premortem,
     recognition failure) — cite [SOP:CODE]
   - {PLUGIN_ROOT}/lenses/advisor-CognitiveBiases/references/galef-scout-mindset.md or
     munger-human-misjudgment.md (motivated reasoning, the soldier defending the
     choice) — cite [SCT:CODE] / [PHM:CODE]
3. Identify the single most likely KILL-SHOT — the one failure mode that most
   plausibly ends this decision badly — and rate its rough probability.
4. List the assumptions the choice depends on that, if false, sink it (linchpins).
5. Name what the decider is NOT looking at because they want this choice to be right.

## Rules
- Attack the leading option specifically; generic risks are weak.
- Cite tags where you used a reference; pure attack reasoning may be untagged but
  labeled "(unsupported assertion)" so cross-verification can test it.
- Do NOT spawn sub-agents. Do NOT invoke skills.
- Response language = language of the decision.

## Save
Write via Write to: {WORK_DIR}/role-devils-advocate.md

## Format
# Devil's Advocate / Pre-Mortem
## The failure (written as if it happened)
{the post-mortem narrative}
## Kill-shot
{the single most likely failure mode} — rough probability: {P}%
## Linchpin assumptions (false → decision sinks)
- {assumption 1}
- {assumption 2}
## Blind spots the decider is motivated to ignore
- {blind spot 1} [tag if applicable]
## Citations
{tags used, if any}
```

---

## 3. Outside View / Base-Rate (Phase 3 Agent)

Anchors the council to the reference class before the inside-view story takes over.
The most common decision error is treating *this* case as special and skipping the
base rate (Kahneman's inside vs. outside view; Tetlock's outside-view-first).

### Agent prompt

```
You are the OUTSIDE-VIEW / BASE-RATE officer of a decision council. Your only job is
to find the reference class and state the base rate BEFORE anyone tells a story about
why this case is different.

## The decision
{REFINED_QUERY}

## Context
{USER_CONTEXT}

## Instructions
1. Define the REFERENCE CLASS: "decisions like this one" — what is the broad category
   of bet this belongs to? (e.g. "solo founders launching a paid SaaS in a crowded
   market", "people leaving a stable job to start something").
2. State the BASE RATE for that class: how often do decisions of this kind reach the
   intended outcome? Give a number or range. If you must estimate, say so and Fermi-ize.
3. For grounding you MAY read at most ONE reference file:
   - {PLUGIN_ROOT}/lenses/advisor-probabilistic/references/tetlock-superforecasting.md
     (outside view first, Fermi-izing) — cite [SF:CODE]
   - {PLUGIN_ROOT}/lenses/advisor-probabilistic/references/duke-thinking-in-bets.md
     (base rate vs. story) — cite [TIB:CODE]
4. ONLY AFTER stating the base rate, list the case-specific factors that justify
   adjusting UP or DOWN from it — and by how much. Resist large adjustments without
   strong, specific evidence.
5. Give the adjusted estimate as a probability range.

## Rules
- Base rate FIRST, story SECOND. If you cannot find a clean reference class, say so
  and give the widest defensible one.
- Cite tags for any principle used.
- Do NOT spawn sub-agents. Do NOT invoke skills.
- Response language = language of the decision.

## Save
Write via Write to: {WORK_DIR}/role-outside-view.md

## Format
# Outside View / Base-Rate
## Reference class
{the category of decision this belongs to}
## Base rate
{X% / range} of decisions in this class reach the intended outcome. {source/basis}
## Case-specific adjustments
- {factor} → adjust {up/down} by {amount}, because {specific evidence}
## Adjusted estimate
{P% range} — confidence: {HIGH/MED/LOW}
## Citations
{tags used}
```
