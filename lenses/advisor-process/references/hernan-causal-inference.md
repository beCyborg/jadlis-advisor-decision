# Causal Inference: What If — Miguel A. Hernán & James M. Robins  ·  prefix [CI]
> A decision is causal only when you can name the counterfactual and the (randomized) experiment you wish you could run; everything else is prediction in disguise. Use this lens whenever "does X cause Y?" or "what if we intervene on X?" is at stake — not when you only need to forecast.

## Principle index
| Code | Principle | Ch | Essence (≤12 words) |
|------|-----------|----|--------------------|
| [CI:01] | Counterfactual contrast | 1 | An effect compares the same units under two interventions, not two groups |
| [CI:02] | Causation ≠ association | 1 | Association answers "in whom?"; causation answers "if everyone?" |
| [CI:03] | Randomization buys exchangeability | 2 | Random assignment makes treated/untreated trade places without changing risks |
| [CI:04] | Identifiability triad | 3 | Need exchangeability, positivity, well-defined intervention — all unverifiable assumptions |
| [CI:05] | No causation without manipulation | 3 | Vague "treatments" (obesity) give vague, uninterpretable effects |
| [CI:06] | Emulate a target trial | 3,22 | Name the trial you'd run; analysis emulates it |
| [CI:07] | No single causal effect | 4 | Effects vary by subpopulation; effect modification is the rule |
| [CI:08] | Bias has structure | 6 | Association flows along paths; colliders block, conditioning opens them |
| [CI:09] | Confounding = common cause | 7 | Open backdoor path via shared cause; close it by adjustment |
| [CI:10] | Selection bias = conditioning on collider | 8 | Selecting on a common effect manufactures association under the null |
| [CI:11] | Measurement bias | 9 | Mismeasured variables bias effects; structure of error dictates the fix |
| [CI:12] | Data can't speak for themselves | 11 | Models trade bias for variance; high dimensions force modeling |
| [CI:13] | Adjustment is not automatic | 18 | Adjusting for colliders/mediators/instruments induces or amplifies bias |
| [CI:14] | Instruments trade assumptions | 16 | IVs identify effects without measuring confounders — at the cost of untestable, fragile assumptions |
| [CI:15] | Time-varying feedback breaks naive adjustment | 20 | When confounders are also effects of treatment, standard adjustment fails; use g-methods |
| [CI:16] | ITT vs per-protocol | 9,22 | "Effect of assignment" and "effect of taking it" answer different questions |

## Principles

### [CI:01] Counterfactual contrast  (ch 1)
- **Essence:** An individual causal effect exists when the outcome under treatment differs from the outcome under no treatment *for the same individual* (Y^{a=1} ≠ Y^{a=0}). Because only one is ever observed, individual effects are not identifiable; we settle for the average effect E[Y^{a=1}] − E[Y^{a=0}].
- **Decision move:** Before debating data, write the two worlds you're comparing: "everyone does A" vs "everyone does B." If you can't state both counterfactual outcomes, the question is malformed.
- **Applies / fails when:** Applies to any "should we do X?" decision. Fails when there is interference (one unit's treatment changes another's outcome) — then the counterfactual isn't even well defined.
- **Example:** "The transplant caused Zeus's death" means: he died with it, would have lived without it. Comparing Zeus (treated) to Hera (untreated) is a different, weaker claim.

### [CI:02] Causation is not association  (ch 1)
- **Essence:** Association contrasts outcomes across *disjoint* subgroups defined by treatment actually received (risk in the treated vs the untreated). Causation contrasts outcomes in *the same* population under two interventions. The gap between them is the whole problem.
- **Decision move:** When handed a correlation ("aspirin users die more"), ask whether the comparison groups would have had equal risk *had they been treated alike*. If not, the number is association, not effect — do not act on it as if causal.
- **Applies / fails when:** Always relevant; the danger peaks when the treated and untreated differ systematically (sicker patients get the drug).
- **Example:** Aspirin's associational risk ratio is 1.5 (high-risk patients are preferentially prescribed it) while its causal risk ratio is 0.5. A doctor who withholds aspirin "because users die more" is reading association as causation and gets sued.

### [CI:03] Randomization manufactures exchangeability  (ch 2)
- **Essence:** Exchangeability means treatment doesn't predict the counterfactual outcome (Y^a ⊥ A): the treated, had they gone untreated, would have had the same risk as the untreated. Randomization produces it because the coin flip can't be caused by anything. Then association *is* causation. Conditional randomization yields exchangeability only within strata of the conditioning variable.
- **Decision move:** Make the comparison groups exchangeable — by physical randomization if you can, or by adjusting for the variables that drove assignment (via standardization / IP weighting) if you can't.
- **Applies / fails when:** Holds by design in trials. In observational settings it's a hope, not a fact, and it cannot be tested from the data.
- **Example:** Two analytic recipes — standardization (weight strata by population share) and IP weighting (reweight each person by 1/probability of their treatment) — are mathematically equivalent ways to simulate the trial you didn't run.

### [CI:04] The identifiability triad (exchangeability, positivity, consistency)  (ch 3)
- **Essence:** Turning observational association into a causal effect requires three external assumptions: (1) **exchangeability** — no unmeasured common causes within strata of L; (2) **positivity** — every level of L has both treated and untreated units (else nothing to compare); (3) **consistency / well-defined intervention** — the treatment values map to real, specified interventions present in the data.
- **Decision move:** For any observational causal claim, list all three and rate each. Positivity is partly checkable (look for empty cells). Exchangeability and consistency are not — they rest on subject-matter knowledge, so make that knowledge explicit and challengeable.
- **Applies / fails when:** These are *necessary*; no statistical sophistication can rescue a violated one. Positivity can be restored by restricting the population (at the cost of generalizability).
- **Example:** Heart-transplant data identify the effect only if you assume the measured covariates (HLA genes, disease severity) capture all reasons doctors chose to transplant — an assumption "no matter how convincing the story" remains untestable.

### [CI:05] No causation without a manipulable intervention  (ch 3)
- **Essence:** If the "treatment" admits many versions with different effects (e.g., "obesity" reachable via genes, inactivity, microbiota), the counterfactual outcome is ill-defined and the causal effect is vague — regardless of how good the data are. This requirement cannot be waived; doing so negates the ability to even describe what was estimated.
- **Decision move:** Reframe vague exposures as specific, implementable actions before estimating anything ("lose 5% of BMI per year" not "be nonobese"). If no realistic intervention exists, downgrade the goal to prediction and stop claiming causation.
- **Applies / fails when:** Bites hardest for biological/social attributes (obesity, race, intelligence); straightforward for medical interventions (this pill vs that pill).
- **Example:** "The effect of obesity on mortality" masks an implicit, unreasonable intervention ("instantly transform everyone to BMI 25 via massive liposuction"). Made explicit, its irrelevance to any real decision becomes obvious.

### [CI:06] Emulate a target trial  (ch 3, 22)
- **Essence:** For every observational causal question, specify the (hypothetical) randomized trial you would run — its eligibility, treatment strategies, time zero, outcome, contrast, and analysis — then design the observational analysis to emulate it. This sharpens the question and exposes hidden absurdities (e.g., comparing prevalent users misaligns eligibility and time zero).
- **Decision move:** Write the protocol of the trial you wish you could run. The discipline forces well-defined interventions, a clean start of follow-up, and an explicit contrast — and reveals when the data simply can't emulate anything interesting.
- **Applies / fails when:** Universal scaffolding for causal questions from data. Doesn't apply to pure prediction (no intervention, no target trial).
- **Example:** A naive "obese vs nonobese at age 40" comparison implies a target trial that instantaneously transforms body weight at baseline — impossible to emulate. "5% annual BMI reduction" emulates a real, decision-relevant trial.

### [CI:07] There is no such thing as *the* causal effect  (ch 4)
- **Essence:** Effects depend on who's in the population: effect modification (the effect differs across strata of V) is generic, and effect *measures* (risk difference vs ratio) can be modified by different variables. The average effect is a property of a particular population, not a transferable constant.
- **Decision move:** Ask "effect for whom, and on which scale?" If the intervention can be targeted to subgroups, compute stratum-specific effects; if it blankets everyone (e.g., water fluoridation), the population average is what matters. To transport a finding elsewhere, you must know the modifiers.
- **Applies / fails when:** Always — but you may legitimately ignore modification when the decision is all-or-nothing for the whole population.
- **Example:** Heart transplant may help men and harm women; the "null" average effect hides large, opposite individual effects.

### [CI:08] Bias has structure — read it off a causal diagram  (ch 6)
- **Essence:** A DAG encodes qualitative knowledge; association then flows along paths like fluid through pipes. Three rules: a chain/fork transmits association (block it by conditioning on the middle node); a **collider** (common effect) blocks association *until* you condition on it or its descendant, which *opens* the path. d-separation operationalizes this.
- **Decision move:** Draw the DAG of your problem. Identify which variables to adjust for (to close backdoor paths) and which to *leave alone* (colliders). Conditioning choices, not just data, determine bias.
- **Applies / fails when:** Requires you to commit to a causal structure from subject knowledge; the data alone can't tell a confounder from a collider.
- **Example:** Lighter-carrying and lung cancer are independent given smoking (fork blocked by conditioning). Haplotype and smoking are independent — until you condition on heart disease (their common effect), which makes them spuriously associated.

### [CI:09] Confounding is bias from a common cause  (ch 7)
- **Essence:** Confounding is the open backdoor path A ← L → Y created by a cause shared by treatment and outcome. Exchangeability holds iff a measured non-descendant set L satisfies the **backdoor criterion** (blocks all backdoor paths, contains no descendants of A). Magnitude and direction matter: weak paths or canceling paths may leave negligible net bias.
- **Decision move:** Enumerate shared causes of "doing X" and "the outcome." Find a measured set that blocks every backdoor path; adjust for it. For unmeasured confounders, run sensitivity analysis to bound the plausible bias and ask whether it could overturn the decision.
- **Applies / fails when:** The core observational threat. Adjustment is impossible if the confounder is unmeasured; then you need IVs (CI:14) or you accept the limitation.
- **Example:** Firefighting → death looks protective because "physically fit" people both become firefighters and survive longer ("healthy worker bias"). Adjusting for fitness closes the path.

### [CI:10] Selection bias is conditioning on a common effect  (ch 8)
- **Essence:** Distinct from confounding: selecting/conditioning on a collider — a common effect of (treatment or its cause) and (outcome or its cause) — induces association even under the null. It arises in randomized trials too, whenever selection happens *after* randomization (loss to follow-up, non-response, survivor analyses).
- **Decision move:** Audit how units entered the analysis. If inclusion depends on a consequence of both treatment and outcome, you have selection bias — randomization won't save you. Collect joint risk factors for selection and outcome, or use IP-of-censoring weights.
- **Applies / fails when:** Any study with dropout, volunteering, case-control sampling, or "survivors only" analysis. Selection *before* treatment assignment in a trial is harmless.
- **Example:** The hazard ratio is built-in selection-biased: at later times you condition on having survived earlier (a collider), so even a treatment with no late effect shows crossing hazards. Same structure underlies Simpson's paradox and Berkson's bias.

### [CI:11] Measurement bias and its structure  (ch 9)
- **Essence:** Mismeasuring treatment, outcome, *or confounders* biases effects even with perfect exchangeability. The structure matters: errors can be independent/dependent and differential/non-differential. Non-differential independent error usually pulls toward the null — but with categorical exposures it can even reverse the direction.
- **Decision move:** Treat "how was each variable measured?" as a first-class question. Classify the error structure to pick a correction (validation samples + modeling). Mismeasured confounders behave like unmeasured confounding — adjusting for the proxy doesn't fully close the backdoor path.
- **Applies / fails when:** Every real study. The only sure remedy is better measurement.
- **Example:** Recall bias (dementia or pregnancy outcome distorts recall of exposure) is differential error — an arrow from Y to the measured exposure — and can bias in either direction.

### [CI:12] Data cannot speak for themselves — modeling is unavoidable  (ch 11)
- **Essence:** With many covariates (high dimensionality), nonparametric stratum-specific estimates collapse: cells are empty or hold one person, and "adjusted" confidence intervals become uninformative (the curse of dimensionality). Models impose structure (a functional form) to borrow strength across strata, trading bias for variance.
- **Decision move:** Accept that you need a model; choose its flexibility by the bias–variance trade-off and your sample size (rule of thumb: ≥10 observations per parameter). Don't fetishize "adjust for everything" — in high dimensions the adjusted estimator can be worse than the crude one.
- **Applies / fails when:** Any realistic dataset with continuous or many covariates. With huge n relative to parameters, modeling matters less.
- **Example:** Estimating mean outcome at dose=90 when no one received exactly 90 requires a model (e.g., linear in dose); the raw sample average is undefined there.

### [CI:13] Adjustment is a choice, not a reflex  (ch 18)
- **Essence:** More covariates ≠ less bias. Adjusting for a **collider** or its descendant induces selection bias (even under the null); for a **mediator**, it blocks part of the effect (over-adjustment); for a pre-treatment collider, it creates **M-bias**; for an **instrument**, it amplifies existing confounding (**Z-bias**). Crucially, data alone cannot distinguish a confounder from a collider — only subject knowledge can.
- **Decision move:** Build the adjustment set from the causal diagram, not from "what's associated." Exclude post-treatment variables unless you've verified they're not affected by treatment, exclude instruments and near-instruments, and never let an automated/lasso/ML selector pick confounders for causal estimands.
- **Applies / fails when:** Every adjusted causal analysis. For pure prediction the rules invert — "whatever improves prediction is fair game."
- **Example:** Adjusting for a randomized-trial instrument (assignment) when unmeasured confounding remains can push the estimate *further* from the truth (Z-bias).

### [CI:14] Instrumental variables trade measurable confounders for unverifiable assumptions  (ch 16)
- **Essence:** An instrument Z (i) is associated with treatment, (ii) affects the outcome only through treatment (exclusion restriction), (iii) shares no causes with the outcome. Given a valid instrument you can identify an effect *without measuring the confounders* — but only condition (i) is testable; (ii) and (iii) are pure assumptions. Without a fourth assumption (homogeneity or monotonicity) an instrument yields only wide bounds, often including the null.
- **Decision move:** Reach for IVs when confounding is unmeasurable and a credible instrument exists (genetic variant, provider preference, access/distance). Then stress-test: is the instrument strong? Weak instruments amplify any violation of (ii)/(iii), give too-narrow CIs, and behave like noise.
- **Applies / fails when:** Valuable in economics, Mendelian randomization, trials with non-compliance. Dangerous when the instrument is weak or the exclusion restriction is shaky.
- **Example:** "Cigarette price" as instrument for quitting is weak (6% risk difference); changing the price threshold flips the estimate from +413 to −128 kg — pure instability, not signal.

### [CI:15] Time-varying treatment-confounder feedback breaks naive adjustment  (ch 20, 21)
- **Essence:** When a confounder (CD4 count) both affects later treatment and is affected by earlier treatment, traditional adjustment (stratification, regression, matching) is biased *no matter what* — conditioning on the confounder blocks a real causal path and/or opens a collider path. Even with sequential exchangeability, only **g-methods** (g-formula, IP weighting of marginal structural models, g-estimation) recover the effect of sustained strategies.
- **Decision move:** For any sequential decision where intermediate outcomes feed back into later choices (dosing, employment, repeated treatment), detect feedback and switch to g-methods; do not "control for" the time-varying confounder with ordinary regression.
- **Applies / fails when:** Longitudinal/sequential interventions. Irrelevant for one-shot, time-fixed treatments.
- **Example:** A sequentially randomized HIV trial with a truly null effect yields a spurious nonzero estimate under standard adjustment for CD4 — because CD4 is both a confounder of later treatment and an effect of earlier treatment.

### [CI:16] Intention-to-treat vs per-protocol — different questions  (ch 9, 22)
- **Essence:** The **ITT effect** is the effect of *assignment* regardless of adherence; it's a misclassified-treatment effect whose size depends on the specific pattern of non-adherence (two unbiased trials can disagree). The **per-protocol effect** is the effect of *actually following* the strategy — usually a dynamic strategy ("treat continuously unless toxicity") — and requires adjusting for time-varying confounding of adherence.
- **Decision move:** State which you want. For "should the policy be offered?" ITT fits; for "what happens if I actually take it as prescribed?" you need the per-protocol effect, which demands g-methods, not a naive as-treated comparison.
- **Applies / fails when:** Any trial or emulation with imperfect adherence. With perfect adherence they coincide.
- **Example:** In a non-blinded HIV trial, ITT answers "effect of being assigned the strategy"; the per-protocol answer ("effect of continuous therapy unless contraindicated") generally compares *dynamic* strategies and needs adjustment for post-baseline confounders.
