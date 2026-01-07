from django.contrib import admin
from .models import (
    UserProfile, Food, Meal, MealFood, MealPlan,
    FoodCategory, DietaryPattern, UserDietaryPreference, UserAllergy, UserFoodDislike
)

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'age', 'height', 'weight', 'activity_level', 'calorie_target', 'created_at']
    list_filter = ['activity_level', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FoodCategory)
class FoodCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ['name', 'calories_per_100g', 'protein_per_100g', 'carbs_per_100g', 'fat_per_100g', 'created_at']
    list_filter = ['created_at', 'categories']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['categories']
    ordering = ['name']


@admin.register(DietaryPattern)
class DietaryPatternAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']
    filter_horizontal = ['excluded_categories']
    ordering = ['name']


@admin.register(UserDietaryPreference)
class UserDietaryPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'pattern', 'created_at']
    list_filter = ['pattern', 'created_at']
    search_fields = ['user__username', 'pattern__name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(UserAllergy)
class UserAllergyAdmin(admin.ModelAdmin):
    list_display = ['user', 'food', 'allergen_name', 'severity', 'created_at']
    list_filter = ['severity', 'created_at']
    search_fields = ['user__username', 'food__name', 'allergen_name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(UserFoodDislike)
class UserFoodDislikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'food', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'food__name']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


class MealFoodInline(admin.TabularInline):
    """Inline admin for MealFood within Meal."""
    model = MealFood
    extra = 1
    fields = ['food', 'quantity_in_grams']


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ['name', 'meal_type', 'created_at']
    list_filter = ['meal_type', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [MealFoodInline]
    ordering = ['-created_at']


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ['user', 'start_date', 'end_date', 'created_at']
    list_filter = ['created_at', 'start_date', 'end_date']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['meals']
    ordering = ['-created_at']
