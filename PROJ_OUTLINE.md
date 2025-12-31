# Smart Nutrition & Fitness Planner — Project Outline

## 1. Project Overview

**Goal:**  
Build a web backend that allows users to:  
- Set fitness goals (calories, macros, activity levels)  
- Generate personalized meal plans based on goals, dietary restrictions, and preferences  
- Produce optimized grocery lists from meal plans  
- Track exercise and adjust meal planning dynamically  

**Scope:**  
The backend will be implemented in Django with Django REST Framework (DRF) for APIs. Future enhancements will include AI-based meal recommendations, optimization algorithms, and scalable architecture.

---

## 2. Tech Stack

| Layer               | Technology                                  |
|--------------------|---------------------------------------------|
| Backend             | Django 5.x                                  |
| API                 | Django REST Framework                        |
| Database            | PostgreSQL                                   |
| Authentication      | Django auth / DRF token or JWT              |
| Containerization    | Docker + Docker Compose                      |
| Background Tasks    | Celery + Redis (future)                      |
| ML / AI             | Optional: scikit-learn, PyTorch (future)    |
| Optional Dev Tools  | Django Admin for data seeding and inspection|

---

## 3. Core Features (MVP — Day 1)

**Health Endpoint**  
- `GET /api/health/` → Returns status “ok” to verify backend is running

**User Management**  
- Create and manage users  
- Store personal attributes: age, weight, height, activity level, calorie/macro targets

**Food Database**  
- Store foods with nutrition info: calories, protein, carbs, fat  
- Seed ~10–20 foods for testing

**Meal Plans**  
- Generate meal plans for users based on calorie targets  
- Simple deterministic algorithm (Day 1)  
- Output meals with food items and quantities

**Grocery List**  
- Aggregate ingredients from meal plans  
- Consolidate quantities  
- Return grocery list per plan

---

## 4. Models (Entities)

**UserProfile**  
- `user` → OneToOneField with Django User  
- `age`, `height`, `weight`, `activity_level`  
- `calorie_target`, `protein_target`, `carb_target`, `fat_target`  

**Food**  
- `name`  
- `calories_per_100g`
