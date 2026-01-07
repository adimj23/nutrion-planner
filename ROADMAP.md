# Intelligent Meal Planning Roadmap

## Phase 1: Preference & Constraint Modeling (Foundational)

### Objective
Explicitly represent who the user is and what they can or will not eat.

### Steps
- Identify the types of constraints your system must respect:
  - Dietary patterns (e.g., vegetarian, keto)
  - Allergies and intolerances
  - Strong dislikes
  - Optional lifestyle constraints (budget, cooking time later)
- Add structured storage for:
  - User dietary preferences
  - User allergies
  - Foods a user explicitly dislikes
- Ensure preferences are:
  - Queryable
  - Enforceable
  - Independent of meal generation logic

### Success Criteria
You can answer:
“Given this user, which foods are allowed?”

No logic depends on free-text interpretation.

---

## Phase 2: Constraint-Aware Meal Planning

### Objective
Upgrade meal plan generation from “calorie math” to “calorie math with constraints”.

### Steps
- Modify meal plan generation to:
  - Filter foods before selection
  - Exclude foods violating preferences or allergies
  - Respect dietary patterns
- Ensure generation fails gracefully:
  - If constraints are too strict, return a clear explanation
  - Never silently violate constraints
- Add deterministic ordering logic:
  - Prefer foods that help meet macro goals
  - Avoid repeating meals too often

### Success Criteria
- Meal plans never include forbidden foods
- Users understand why a plan was generated or rejected

---

## Phase 3: Explainability & Decision Tracing

### Objective
Make the system explainable and debuggable.

### Steps
- Introduce a way to record:
  - Why foods were excluded
  - Why meals were selected
  - How calorie targets were satisfied
- Attach explanations to:
  - Meal plans
  - Grocery lists
- Ensure explanations are:
  - Human-readable
  - Stored, not inferred later

### Success Criteria
You can answer:
> “Why did the system choose this meal?”

Debugging doesn’t require re-running logic.

---

## Phase 4: LLM Integration (Controlled & Bounded)

### Objective
Use an LLM only where creativity is needed, not where correctness is required.

### Steps
- Define exactly what the LLM is responsible for:
  - Recipe ideas
  - Meal descriptions
  - Cooking instructions
- Pass the LLM:
  - Structured nutritional goals
  - Allowed foods only
  - Explicit exclusions
- Validate all LLM output:
  - Normalize ingredients to known foods
  - Reject invalid macros or forbidden items
  - Log failures for analysis

### Success Criteria
- LLM output is never trusted blindly
- System remains deterministic even if the LLM fails

---

## Phase 5: Feedback & Adaptation Loop

### Objective
Make the system learn from user behavior.

### Steps
- Capture user feedback:
  - Meal ratings
  - Whether meals were eaten or skipped
- Use feedback to:
  - Deprioritize skipped meals
  - Prefer high-rated meals
  - Adjust portioning or meal distribution
- Track adherence over time:
  - Planned vs actual calories
  - Trend analysis (consistent under/over eating)

### Success Criteria
- The system improves recommendations over time
- Plans adapt without manual user tuning

---

## Phase 6: Dynamic Goal Adjustment

### Objective
Move from static goals to adaptive goals.

### Steps
- Monitor:
  - Weight trends
  - Calorie adherence
  - User feedback consistency
- Adjust:
  - Daily calorie targets
  - Macro ratios
  - Meal size distribution
- Keep changes:
  - Small
  - Transparent
  - Reversible

### Success Criteria
- Goals evolve automatically
- Users can understand and override adjustments

---

## Phase 7: Product Polish (Only After Intelligence Is Solid)

### Objective
Prepare the system for real users.

### Steps
- Add API documentation
- Add role-based permissions
- Introduce caching where aggregation is heavy
- Begin frontend integration

### Success Criteria
- Backend feels production-ready
- Frontend integration is straightforward
