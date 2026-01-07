# Frontend Layout & UX Architecture

The frontend is organized around a **goal-driven nutrition workflow**, balancing **daily tracking** with **forward-looking meal planning**. The layout emphasizes clarity, low friction for logging, and strong visibility into how planning decisions map to calories and groceries.

---

## Global Layout

**Persistent Navigation (Left Sidebar or Top Navigation Bar)**  
- Dashboard / Today  
- Meal Planner  
- Grocery List  
- Goals & Preferences  
- Profile / Settings  

This navigation structure keeps users oriented around **today vs planning vs setup**.

---

## 1. Dashboard / Daily Nutrition Page (Primary Entry Point)

This is the **main page users return to daily**.

### Daily Summary Section
- Calories consumed vs daily target (progress bar or ring)
- Macro breakdown (protein, carbs, fat)
- Remaining calories for the day
- Activity-based calorie adjustment indicator (if enabled)

### Meal Log Timeline
- Sections for:
  - Breakfast
  - Lunch
  - Dinner
  - Snacks
- Each meal entry displays:
  - Foods consumed
  - Calories and macro contribution
- **Add Meal** actions:
  - Manual food entry
  - Select from generated meal plans
  - Quick-add frequently eaten foods

**UX Focus:**  
Answer the question:  
> *“How am I doing today relative to my goals?”*

---

## 2. Meal Generation Hub (Planning Center)

This page supports **future-oriented meal planning**.

### Goal Context Panel
- Current calorie and macro targets
- Dietary constraints (vegetarian, allergies, dislikes)
- Planning horizon selector (e.g., 1 day, 3 days, 1 week)

### Meal Plan Generator
- LLM-powered meal generation:
  - Macro-constrained
  - Preference-aware
  - Variety-optimized
- Output includes:
  - Per-day meal breakdown
  - Calories and macros per meal

### User Controls
- Regenerate individual meals
- Lock meals the user likes
- Adjust macro bias (e.g., higher protein)

### Plan Approval Flow
- Accept full plan
- Swap specific meals
- Save plan to calendar or tracking flow

**UX Focus:**  
Answer the question:  
> *“What should I eat next to stay on track?”*

---

## 3. Grocery List Page (Execution Layer)

This page turns planning into **real-world execution**.

### Consolidated Grocery List
- Ingredients aggregated across selected meal plans
- Normalized quantities (grams, units)
- Categorized by store section (produce, protein, pantry)

### Interaction Features
- Check off items while shopping
- Adjust quantities
- Export or share grocery list
- Auto-update list when meal plans change

**UX Focus:**  
Answer the question:  
> *“What do I need to buy to execute this plan?”*

---

## 4. Goals & Preferences Page (Personalization Layer)

This page defines the **constraints that power the system**.

### Fitness Goals
- Calorie targets (fixed or adaptive)
- Macro ratios
- Weight goals (cut, bulk, maintain)

### Preferences & Dietary Constraints
- Dietary patterns
- Allergies and intolerances
- Strong dislikes
- Cooking complexity preference (future enhancement)

### Dynamic Propagation
Changes here automatically affect:
- Meal generation
- Grocery list composition
- Daily calorie and macro targets

**UX Focus:**  
Answer the question:  
> *“Who am I, and what should the system optimize for?”*

---

## 5. System Design Philosophy

- **Separation of concerns**
  - Tracking ≠ Planning ≠ Shopping
- **Daily habits + long-term planning**
  - Daily logging combined with weekly planning
- **Tight feedback loop**
  - Generated meals → grocery list → logged meals → updated planning
- **LLM as an assistant**
  - AI supports decisions without removing user control
