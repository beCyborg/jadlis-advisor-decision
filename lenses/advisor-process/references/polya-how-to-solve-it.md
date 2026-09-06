# How to Solve It — George Pólya  ·  prefix [HSI]
> Hard problems yield to a small, repeatable set of general questions applied in four phases (understand → plan → execute → review). Use this lens when a decision is really an unsolved *problem*: the goal is fuzzy, the path is unknown, and you need a method to manufacture the missing idea rather than just weigh known options.

## Principle index
| Code | Principle | Ch | Essence (≤12 words) |
|------|-----------|----|--------------------|
| [HSI:01] | Four phases | I.6 | Understand, plan, execute, look back — in order, none skipped. |
| [HSI:02] | Define unknown, data, condition | I.7 | Name what you seek, what you have, what links them. |
| [HSI:03] | Test the condition early | III | Guess whether condition is sufficient, redundant, or contradictory. |
| [HSI:04] | Find a related solved problem | I.9 | Mobilize past solutions sharing the same unknown. |
| [HSI:05] | Look at the unknown | III | Steer recall by the goal, not the givens. |
| [HSI:06] | Vary the problem | III | Restate, generalize, specialize, drop conditions to find traction. |
| [HSI:07] | Auxiliary problem / element | III | Solve an easier proxy or add a helpful new element. |
| [HSI:08] | Inventor's paradox | III | A bolder, more general problem can be easier. |
| [HSI:09] | Working backwards (analysis/synthesis) | III | Assume the goal reached; ask what antecedent yields it. |
| [HSI:10] | Bridge from the data | III | Ask what the givens can produce, then steer toward goal. |
| [HSI:11] | Decompose and recombine | III | Break the whole into parts, reassemble into new wholes. |
| [HSI:12] | Check each step while executing | I.11 | Verify correctness of every move as you go. |
| [HSI:13] | Did you use all the data? | I.9 | Unused givens signal an incomplete or wrong solution. |
| [HSI:14] | Look back: check, vary, reuse | I.13 | Verify result, derive it differently, harvest the method. |
| [HSI:15] | Heuristic reasoning & examine your guess | III | Provisional plausible reasoning is legitimate scaffolding toward certainty. |
| [HSI:16] | General before specific (Socratic ladder) | I.16 | Start with broad prompts, descend to concrete only as needed. |
| [HSI:17] | Reasonable share of the work | I.1 | Give help that the decider could have produced themselves. |
| [HSI:18] | Analogy | III | Transfer structure from a problem that agrees in relations. |
| [HSI:19] | Practical-problem caveat | III | Real problems have vague conditions and uncounted data. |

## Principles

### [HSI:01] Four phases  (ch I.6)
- **Essence:** Every nontrivial problem passes through four distinct phases — *understand* the problem, *devise a plan*, *carry out* the plan, *look back* — and your conception of the problem shifts at each. Most failure comes from jumping a phase: computing before understanding, or executing with no plan.
- **Decision move:** Before acting, locate which phase you are actually in and refuse to advance until that phase is genuinely done. Treat "we're rushing to a solution" as a phase violation.
- **Applies / fails when:** Applies to any goal-directed problem, math or not. Adds overhead to trivial/routine decisions where the answer is mechanical.
- **Example:** A team debating *which* vendor (planning) before they have agreed *what* the contract must achieve (understanding) — Pólya says stop and finish phase one.

### [HSI:02] Define unknown, data, condition  (ch I.7)
- **Essence:** Three universal questions open every problem: *What is the unknown?* (what you seek), *What are the data?* (what you have), *What is the condition?* (the relation tying data to unknown). These work on any problem regardless of subject.
- **Decision move:** Force a one-sentence statement of each. Make the decider restate the problem fluently and point to each part; if they can't, understanding is incomplete.
- **Applies / fails when:** Universal for "problems to find." For "problems to prove," substitute hypothesis/conclusion. Hardest part of real research is often just nailing what the problem says.
- **Example:** "Should we expand?" → unknown: which markets and by when; data: cash, team, demand signals; condition: the expansion must not breach runway.  <!-- privacy-ok: термин из книжного конспекта, не финансы владельца -->

### [HSI:03] Test the condition early  (ch III)
- **Essence:** Ask provisionally whether the condition is *sufficient* to determine the unknown, or *insufficient, redundant, or contradictory* — and whether the problem is "reasonable" (admits a unique answer). A guess, not a proof, is wanted here.
- **Decision move:** Early on, sanity-check feasibility: is there enough to decide? Too much? Conflicting requirements? Only spend effort on this if the answer is cheap; drop it if it's as hard as the problem.
- **Applies / fails when:** Useful when the check is quick and reshapes the work. Skip when answering it is harder than the problem itself.
- **Example:** "Hit $1M ARR, keep burn under $50k/mo, and don't raise" — flag as possibly contradictory *before* planning around all three.

### [HSI:04] Find a related solved problem  (ch I.9)
- **Essence:** Good ideas are built from prior knowledge — you cannot invent from nothing. The opening move of planning is *Do you know a related problem?* / *Have you seen it before?* Mobilize formerly solved cases, their results, or their methods.
- **Decision move:** Before inventing, inventory precedents: have we (or others) solved something structurally like this? Reuse its result *or* its method.
- **Applies / fails when:** Powerful when analogues exist and you can recall them. Risk: too many loosely-related problems — filter with [HSI:05].
- **Example:** Facing a churn spike, recall a past activation problem you fixed; reuse the cohort-analysis method even if the result differs.

### [HSI:05] Look at the unknown  (ch III)
- **Essence:** "Respice finem" — keep the goal in view and let it drive recall. The filter for *which* related problem matters is: find a familiar problem with the *same or similar unknown*. The unknown, not the data, indexes useful memory.
- **Decision move:** When precedents are overwhelming, re-anchor on the goal: "what other problem sought the same kind of answer?" Discard analogues that match surface data but not the target.
- **Applies / fails when:** Best when the unknown is well-defined. Less help when the goal itself is the thing in dispute.
- **Example:** Need "a way to measure indirect ROI" → recall any past problem whose unknown was an indirect/proxy metric, regardless of domain.

### [HSI:06] Vary the problem  (ch III)
- **Essence:** When direct attack fails, transform the problem rather than retry the same move. Levers: *restate it*, *generalize*, *specialize*, *use analogy*, *drop part of the condition*. Intelligence is varying your trials with understanding — not the insect battering one windowpane.
- **Decision move:** Stuck? Don't push harder on the same framing. Deliberately produce 3–4 variants (broader, narrower, analogous, partial) and probe each for traction.
- **Applies / fails when:** Core unsticking technique. Requires discipline to abandon a sunk framing; aimless reframing wastes time if not steered by the goal.
- **Example:** "Can't price this feature" → specialize ("price it for enterprise only") or drop a condition ("ignore competitors for now") to get a foothold.

### [HSI:07] Auxiliary problem / element  (ch I.9)
- **Essence:** If you cannot solve the proposed problem, solve a *related, more accessible* one first (an auxiliary problem); or introduce a new *auxiliary element* not originally present that makes a known method usable. Human superiority is going around an obstacle you can't break through directly.
- **Decision move:** When blocked, ask "what easier sub-problem, if solved, would unlock this?" or "what could I add to the situation to make a known approach apply?"
- **Applies / fails when:** Works when a simpler proxy genuinely informs the original. Danger: solving auxiliaries that drift away from the real goal — check with [HSI:13].
- **Example:** Can't forecast 5-year demand → first solve the auxiliary "estimate next-quarter demand for one segment," then build up.

### [HSI:08] Inventor's paradox  (ch III)
- **Essence:** "The more ambitious plan may have more chances of success." A more general problem can be *easier* than the specific one, because generality removes incidental clutter and exposes the real structure — provided the ambition rests on a vision, not pretension.
- **Decision move:** When a narrow problem resists, try solving a deliberately broader version. If the general case is cleaner, the specific answer falls out for free.
- **Applies / fails when:** Applies when extra generality reveals structure. Fails when "more ambitious" just means "more scope" with no unifying insight — that's overreach.
- **Example:** Instead of "how do we onboard *this* client," design "a repeatable onboarding for any client of this type" — often clarifies and solves the one.

### [HSI:09] Working backwards (analysis & synthesis)  (ch III)
- **Essence:** Pappus's method. In *analysis*, assume the goal already achieved and ask "from what antecedent could this be derived?", then the antecedent of that, until you reach something you already have. Then *synthesis* runs forward from the known to the goal. Forward trial-and-error is the amateur's path; backward regression is the expert's.
- **Decision move:** Picture the desired end-state concretely, then ask repeatedly "what state immediately before this would produce it?" until you hit your current resources. Reverse the chain to act.
- **Applies / fails when:** Strong when the goal is crisp and steps are reversible. Weaker if many antecedents are equally plausible or steps don't cleanly invert.
- **Example:** Goal: signed deal by Friday. Backward: signature needs approved terms → terms need a redline pass → redline needs their legal's input today → so send the draft now.

### [HSI:10] Bridge from the data  (ch III)
- **Essence:** The complement to working backwards: *Could you derive something useful from the data?* You can build the bridge across the gap from either bank — start from the givens and ask what they readily produce, then aim those products toward the unknown.
- **Decision move:** When backward analysis stalls, switch banks: list what your current data/resources can immediately generate, and look for products that point at the goal. Use both directions until they meet.
- **Applies / fails when:** Useful when data is rich but the goal-path is murky; pairs with [HSI:09]. Pure forward exploration risks aimlessness — keep the unknown in view.
- **Example:** You have usage logs and support tickets (data); ask what each can yield (cohorts, top friction points) and steer toward the unknown "where to invest next."

### [HSI:11] Decompose and recombine  (ch III)
- **Essence:** Examine the whole, then break it into parts, study each in isolation, and recombine into a freshly-seen whole. But decompose *only as far as you need* — too much detail buries the main point ("can't see the forest for the trees").
- **Decision move:** Alternate zoom levels: grasp the whole first, isolate the parts that look essential, then reassemble. Stop decomposing once the key relation is visible.
- **Applies / fails when:** Essential for complex problems with interacting parts. Over-decomposition wastes effort on details that prove irrelevant; you can't always know in advance which matter.
- **Example:** A failing product launch: separate pricing, messaging, channel, timing; find messaging is the bind; recombine with that fixed.

### [HSI:12] Check each step while executing  (ch I.11)
- **Essence:** Carrying out a plan is mostly patience; the discipline is to *check each step* — be honestly convinced each move is correct, by insight or by proof, leaving no dark corner where an error hides. A good plan can still fail through sloppy execution.
- **Decision move:** As you execute, verify each step before the next. Distinguish "I see it's right" from "I can prove it's right" and demand the stronger one for load-bearing steps.
- **Applies / fails when:** Critical for long/involved chains where one bad step voids the rest. Over-checking trivial steps slows execution needlessly.
- **Example:** Rolling out a migration: validate each cutover stage (data integrity, rollback works) before proceeding, not at the end.

### [HSI:13] Did you use all the data?  (ch I.9)
- **Essence:** A correct solution to a "problem to find" should use *all* the data and the *whole* condition. Unused givens are a red flag: either you've drifted to the wrong problem or the solution is incomplete. (For proofs: did you use the whole hypothesis?)
- **Decision move:** Before committing, audit: does the proposed answer engage every constraint and input? An ignored constraint usually means the answer is wrong or you've solved a different problem.
- **Applies / fails when:** Sharp test when data is genuinely all relevant. Note: real practical problems may include genuinely irrelevant data ([HSI:19]) — then this test loosens.
- **Example:** A plan that satisfies budget and timeline but silently ignores the regulatory constraint hasn't solved the actual problem.

### [HSI:14] Look back: check, vary, reuse  (ch I.13)
- **Essence:** No problem is ever fully exhausted. After solving, *look back*: can you check the result and the argument? Can you *derive it differently* (a second, independent route raises confidence like a second sense)? Can you reuse the result or method elsewhere? This consolidates knowledge and builds transferable skill.
- **Decision move:** After a decision, run three reviews: verify it (ideally by an independent method), seek a simpler derivation, and extract the reusable method for future cases. Don't shut the book at "done."
- **Applies / fails when:** High-leverage for learning organizations and repeated decisions. Skippable only for genuinely one-off trivia.
- **Example:** Closed a tough hire via a structured rubric — verify the call against references (second route), then template the rubric for all future hires.

### [HSI:15] Heuristic reasoning & examine your guess  (ch III)
- **Essence:** Provisional, plausible reasoning ("heuristic reasoning") is legitimate and necessary — it's the scaffolding you need before the building (the proof/certainty) stands. A vivid guess arising *after* serious engagement usually contains a fragment of truth; foolish to accept it as proven, equally foolish to discard it.
- **Decision move:** Permit yourself a working hypothesis to make progress, but tag it as provisional and schedule its test. Take informed hunches seriously enough to examine, not seriously enough to trust unexamined.
- **Applies / fails when:** Indispensable under uncertainty when full proof is unavailable yet. Fails when a plausible guess is mistaken for established fact and acted on irreversibly.
- **Example:** "I suspect the churn is onboarding-driven" — a heuristic guess worth a quick cohort test, not a budget reallocation on faith.

### [HSI:16] General before specific (Socratic ladder)  (ch I.16)
- **Essence:** The questioning method: begin with the most general, natural prompt and descend gradually to more specific, concrete ones only as needed — until one elicits the idea. Specific-first "help" (e.g., "just apply Pythagoras") gives the secret away, teaches nothing transferable, and feels like a rabbit from a hat.
- **Decision move:** When guiding yourself or others, open with the broad question ("do you know a related problem?") and tighten only when no response comes. Resist jumping straight to the concrete hint.
- **Applies / fails when:** Builds durable skill and ownership. Costs more time than just handing over the answer; bad when speed strictly dominates learning.
- **Example:** Coaching a report stuck on a forecast: ask "what's the unknown?" not "use last year × 1.2" — the specific shortcut teaches nothing for next time.

### [HSI:17] Reasonable share of the work  (ch I.1)
- **Essence:** Help should leave the decider a *reasonable share of the work*: not so much that nothing's left to them, not so little they stall. The ideal hint is one that *could have occurred to them*, given discreetly and naturally.
- **Decision move:** When assisting, calibrate intervention: offer the question or step the person could plausibly have found themselves, preserving their ownership and learning. Withhold the full answer unless they're truly stuck.
- **Applies / fails when:** Right for developing capability and buy-in. Wrong in emergencies where you should just give the answer.
- **Example:** Reviewing a junior's strategy memo: ask "what does the data not yet support?" rather than rewriting their conclusion.

### [HSI:18] Analogy  (ch III)
- **Essence:** Analogy is similarity of *relations*, not of surface features — analogous objects agree in how their parts relate. It's among the most fertile sources of plans: a solved problem analogous in structure suggests both approach and result for the new one.
- **Decision move:** Seek a problem from another domain that shares the *relational structure* (not the topic) of yours, and import its solution pattern. Verify the structural mapping actually holds before trusting it.
- **Applies / fails when:** Powerful for novel problems with no direct precedent. Fails when the analogy is superficial — matching surface, not relations — leading to false transfer.
- **Example:** Pricing a marketplace's take-rate by analogy to congestion-pricing a road (both: a relation between flow, demand, and a clearing fee), not by analogy to "other apps charge 30%."

### [HSI:19] Practical-problem caveat  (ch III)
- **Essence:** Practical (real-world) problems differ from clean mathematical ones: their *conditions are vaguely stated*, they carry *many more data*, and not all data is relevant. The principal motives and procedures are nevertheless the same — the four phases and the list still apply.
- **Decision move:** On messy real decisions, expect to first *clarify a fuzzy condition* and *triage relevant from irrelevant data* before the standard method bites. Don't demand mathematical crispness that isn't there; don't abandon the method either.
- **Applies / fails when:** This is the bridge from Pólya's math examples to business/life decisions. The "use all the data" test ([HSI:13]) must be relaxed because some data is genuinely noise.
- **Example:** "Should we restructure the team?" — the condition (what "better" means) is vague and a flood of data (morale, cost, politics) is mixed signal; clarify the goal and triage inputs first.
