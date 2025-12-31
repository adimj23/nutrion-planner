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