# Vote2Watch 2027

Experimental, research-oriented fork of VoteWatch for Kenya's 2027 presidential election.

**Source baseline:** copied from `dansamuka/votewatch` on 4 October 2026.  
**Original VoteWatch is intentionally unchanged.**  
**Live target:** https://dansamuka.github.io/vote2watch/

Vote2Watch is a **scenario-intelligence model, not a point forecast**. It combines polling, regional political geography, coalition/ticket assumptions, voter-register scenarios, turnout, Article 138 rules and Monte Carlo uncertainty. The October 2026 overhaul deliberately removes false ward precision and separates measured evidence from political assumptions.

## What changed in the audit overhaul

### 1. Canonical election geography

- 47 counties
- 290 constituencies
- **1,450 County Assembly wards**
- 2022 ward register reconciles exactly to **22,102,532 voters**
- ward hierarchy comes from the governed Kenya Data Atlas legal-order transcription
- ward registered-voter counts come from the IEBC 2022 ward schedule used by the Atlas

The previous 1,457-row pseudo-ward structure is retired.

### 2. Honest ward resolution

Ward names and 2022 registered-voter counts are genuine ward-level records.

Political preference and turnout are **not** independently inferred at ward level yet. They remain constituency-imputed and every ward result carries:

```
basis: "constituency_imputed"
```

The UI and CSV export explicitly disclose this. Wards within a constituency therefore intentionally retain the same political-share estimate until defensible ward-specific covariates or results are available.

### 3. Voter-register scenarios

The model no longer applies one uniform national growth factor to every county.

Three register modes are available:

- **Current proxy** — 2022 register plus the IEBC national total of 2,936,516 new registrations reported by 20 August 2026. County allocation uses the official 28 April 2026 ECVR county shares. Total proxy: **25,039,048**.
- **IEBC 2027 target scenario** — approximately **28.5 million** voters, allocated using the same official April county enrolment distribution. This is a scenario, not a gazetted register.
- **2022 certified register** — **22,102,532**.

The April county ECVR total reconciles to **2,345,476**.

### 4. Poll governance

The central model now uses only **model-eligible / validated polls** and weights them by:

- recency
- sample size
- pollster-quality prior

Held-out polls such as Mizani and Politrack are not silently embedded in the central baseline. They are available through a clearly labelled **All published polls — sensitivity only** mode, with lower pollster-quality weights.

Candidates supported by only one observation are shrunk strongly toward a small prior instead of being treated as equally certain to repeatedly polled candidates.

### 5. Candidate and youth geography

National candidate levels are fitted to regional profiles through iterative proportional fitting.

The starting pattern uses:

- regional polling strength
- home-county effects
- softened 2022 constituency lean
- a modest youth-preference gradient

The youth control still changes turnout, but candidate profiles can now also respond modestly to the youth composition of an area. This is deliberately conservative; it does not manufacture independent ward estimates.

### 6. Coalition transfers

The old universal rule — one off-ticket follow-through rate plus one 30/40/30 stay/cross/elsewhere split — has been replaced by **candidate × region transfer priors**.

For example, Babu Owino supporters in Luo Nyanza, Gachagua supporters in Mt Kenya, Sifuna supporters in Western/Nairobi and Matiang'i supporters in Gusii no longer leak to a rival at the same rate.

The UI's follow-through/leakage controls now scale these priors rather than overwrite them with one national matrix.

### 7. Run-off model

The central run-off no longer assumes eliminated voters split 50/50.

Transfers are modelled by:

- eliminated candidate/team
- finalist pairing
- county group
- correlated transfer uncertainty

A politician's endorsement can therefore over- or under-perform nationally in one simulated election instead of transfer errors averaging away county by county.

The Run-off tab still shows 70/30 sensitivity bounds.

### 8. Two uncertainty layers

The site now distinguishes:

1. **Conditional simulation uncertainty** — random uncertainty inside the selected coalition/poll/register scenario.
2. **Structural political uncertainty** — the range across the preset coalition paths.

The structural range is not presented as a probability interval.

### 9. Projects, rallies and hype

Development tours, project announcements and other high-salience political events are tracked as **signals**.

They do **not** automatically add vote points. An event can enter calibration only when subsequent polling or other defensible evidence measures an effect.

### 10. Automated model gate

`scripts/validate-model.mjs` runs before every GitHub Pages build and checks:

- 47 counties
- 290 constituencies
- 1,450 wards
- exact 2022 ward-register reconciliation
- current and target voter-register totals
- county ward counts
- constituency-imputation disclosure
- poll-governance separation
- national/county share normalization
- Luo-Nyanza and Gusii calibration guardrails
- non-50/50 central run-off behaviour
- visible structural uncertainty

A failed model check blocks deployment.

## Current default scenario

The default remains a **testing scenario**, not a forecast:

- **Team A:** William Ruto / Kithure Kindiki, with the government-aligned ODM wing
- **Team B:** Kalonzo Musyoka / Edwin Sifuna, with other opposition principals
- **Third force:** Fred Matiang'i / Ndindi Nyoro
- remaining candidates can run solo or be reassigned interactively

With the 4 October 2026 validated-poll/current-register calibration, the deterministic default is approximately:

| Side | Share |
|---|---:|
| Team A | 38.6% |
| Team B | 37.6% |
| Others | 23.9% |

The all-published-polls sensitivity is approximately 40.3% / 36.8% / 22.9%.

These numbers will change as source data and coalition settings change.

## Structure

```
index.html              application shell and controls
css/tokens.css          design tokens
css/app.css             components and responsive/print rules
data/context.js         polls, candidate profiles, transfer priors, salient events
data/counties.js        county baselines and voter-register scenarios
data/wards.js           canonical 1,450 wards + 2022 ward voters + imputation flags
data/kenya-geo.js       county geometry
data/transport.js       synthetic event-spillover network
js/app.js               model, simulations, Article 138, report rendering
js/viz.js               charts and race visualisations
js/map.js               county map and county panel
js/enhance.js           navigation and interaction enhancements
scripts/validate-model.mjs governed model/data regression tests
scripts/build.mjs       static bundle build
docs/AUDIT.md           audit trail and methodology decisions
```

## Run locally

```bash
node scripts/validate-model.mjs
python -m http.server 8000
```

For the production bundle:

```bash
node scripts/build.mjs
```

## Responsible use

Do not describe ward percentages as ward forecasts. They are constituency-imputed estimates attached to the official ward hierarchy for drill-down and voter-weighting purposes.

Do not describe Monte Carlo win shares as unconditional probabilities of the 2027 election. They are conditional on the selected polling, coalition, transfer and register scenario.

Do not treat the 28.5 million IEBC planning target as a final register.

See `docs/AUDIT.md` for the detailed audit history and calibration notes.
