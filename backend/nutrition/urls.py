from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health_check, UserViewSet, UserProfileViewSet, FoodViewSet,
    MealViewSet, MealPlanViewSet,
    UserDietaryPreferenceViewSet, UserAllergyViewSet, UserFoodDislikeViewSet,
    DietaryPatternViewSet, FoodCategoryViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'foods', FoodViewSet, basename='food')
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'meal-plans', MealPlanViewSet, basename='mealplan')
router.register(r'dietary-preferences', UserDietaryPreferenceViewSet, basename='dietary-preference')
router.register(r'allergies', UserAllergyViewSet, basename='allergy')
router.register(r'food-dislikes', UserFoodDislikeViewSet, basename='food-dislike')
router.register(r'dietary-patterns', DietaryPatternViewSet, basename='dietary-pattern')
router.register(r'food-categories', FoodCategoryViewSet, basename='food-category')

urlpatterns = [
    path('health/', health_check),
    path('', include(router.urls)),
    # UserProfile endpoints nested under users
    path('users/<int:pk>/profile/', UserProfileViewSet.as_view({
        'post': 'create',
        'get': 'retrieve',
        'put': 'update'
    }), name='user-profile'),
]
