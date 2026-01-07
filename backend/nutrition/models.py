from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

# Create your models here.

class FoodCategory(models.Model):
    """
    Food categories/tags for dietary filtering.
    Examples: contains_dairy, contains_gluten, is_vegetarian, is_vegan, etc.
    """
    CATEGORY_CHOICES = [
        ('contains_dairy', 'Contains Dairy'),
        ('contains_gluten', 'Contains Gluten'),
        ('is_vegetarian', 'Vegetarian'),
        ('is_vegan', 'Vegan'),
        ('is_meat', 'Meat'),
        ('is_seafood', 'Seafood'),
        ('is_egg', 'Contains Egg'),
        ('is_nut', 'Contains Nuts'),
        ('is_soy', 'Contains Soy'),
    ]
    
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Food Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.get_name_display()

class UserProfile(models.Model):
    ACTIVITY_LEVEL_CHOICES = [
        ('sedentary', 'Sedentary'),
        ('lightly_active', 'Lightly Active'),
        ('moderately_active', 'Moderately Active'),
        ('very_active', 'Very Active'),
        ('extra_active', 'Extra Active'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    age = models.PositiveIntegerField()
    height = models.DecimalField(max_digits=5, decimal_places=2, help_text="Height (inches)")
    weight = models.DecimalField(max_digits=5, decimal_places=2, help_text="Weight (lbs)")
    activity_level = models.CharField(max_length=20, choices=ACTIVITY_LEVEL_CHOICES)
    calorie_target = models.PositiveIntegerField()
    protein_target = models.DecimalField(max_digits=6, decimal_places=2, help_text="Protein target in grams")
    carb_target = models.DecimalField(max_digits=6, decimal_places=2, help_text="Carb target in grams")
    fat_target = models.DecimalField(max_digits=6, decimal_places=2, help_text="Fat target in grams")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Food(models.Model):
    """
    Food model storing nutritional information per 100g.
    Designed to support future integration with external nutrition APIs.
    """
    name = models.CharField(max_length=200, unique=True)
    calories_per_100g = models.DecimalField(max_digits=6, decimal_places=2, help_text="Calories per 100g")
    protein_per_100g = models.DecimalField(max_digits=6, decimal_places=2, help_text="Protein in grams per 100g")
    carbs_per_100g = models.DecimalField(max_digits=6, decimal_places=2, help_text="Carbs in grams per 100g")
    fat_per_100g = models.DecimalField(max_digits=6, decimal_places=2, help_text="Fat in grams per 100g")
    fiber_per_100g = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        help_text="Fiber in grams per 100g (optional)"
    )
    sugar_per_100g = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        help_text="Sugar in grams per 100g (optional)"
    )
    categories = models.ManyToManyField(FoodCategory, blank=True, related_name='foods', help_text="Dietary categories/tags for this food")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def calculate_nutrition(self, quantity_grams):
        """
        Calculate nutrition for a given quantity in grams.
        Returns a dictionary with all nutritional values.
        """
        # Convert quantity_grams to Decimal if it's not already
        quantity = Decimal(str(quantity_grams))
        multiplier = quantity / Decimal('100')
        
        return {
            'calories': float(self.calories_per_100g * multiplier),
            'protein': float(self.protein_per_100g * multiplier),
            'carbs': float(self.carbs_per_100g * multiplier),
            'fat': float(self.fat_per_100g * multiplier),
            'fiber': float(self.fiber_per_100g * multiplier) if self.fiber_per_100g else None,
            'sugar': float(self.sugar_per_100g * multiplier) if self.sugar_per_100g else None,
        }


class Meal(models.Model):
    """
    Meal model representing a single meal (breakfast, lunch, dinner, snack).
    Contains multiple foods with quantities.
    """
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ]
    
    name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES, default='breakfast')
    foods = models.ManyToManyField(Food, through='MealFood', related_name='meals')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.meal_type})"

    def calculate_total_nutrition(self):
        """
        Calculate total nutrition for the meal by summing all foods.
        Returns a dictionary with total nutritional values.
        """
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0
        total_fiber = 0
        total_sugar = 0

        for meal_food in self.mealfood_set.all():
            nutrition = meal_food.food.calculate_nutrition(meal_food.quantity_in_grams)
            total_calories += nutrition['calories']
            total_protein += nutrition['protein']
            total_carbs += nutrition['carbs']
            total_fat += nutrition['fat']
            if nutrition['fiber']:
                total_fiber += nutrition['fiber']
            if nutrition['sugar']:
                total_sugar += nutrition['sugar']

        return {
            'calories': round(total_calories, 2),
            'protein': round(total_protein, 2),
            'carbs': round(total_carbs, 2),
            'fat': round(total_fat, 2),
            'fiber': round(total_fiber, 2) if total_fiber > 0 else None,
            'sugar': round(total_sugar, 2) if total_sugar > 0 else None,
        }


class MealFood(models.Model):
    """
    Through model connecting Meal to Food with quantity.
    """
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity_in_grams = models.DecimalField(max_digits=8, decimal_places=2, help_text="Quantity in grams")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['meal', 'food']]

    def __str__(self):
        return f"{self.meal.name} - {self.food.name} ({self.quantity_in_grams}g)"


class MealPlan(models.Model):
    """
    MealPlan model linking a user to multiple meals.
    Can optionally have a date range for planning.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans')
    meals = models.ManyToManyField(Meal, related_name='meal_plans')
    start_date = models.DateField(null=True, blank=True, help_text="Optional start date for the meal plan")
    end_date = models.DateField(null=True, blank=True, help_text="Optional end date for the meal plan")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        date_range = ""
        if self.start_date and self.end_date:
            date_range = f" ({self.start_date} to {self.end_date})"
        elif self.start_date:
            date_range = f" (from {self.start_date})"
        return f"Meal Plan for {self.user.username}{date_range}"


    def calculate_total_nutrition(self):
        """
        Calculate total nutrition for the entire meal plan.
        """
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0

        for meal in self.meals.all():
            nutrition = meal.calculate_total_nutrition()
            total_calories += nutrition['calories']
            total_protein += nutrition['protein']
            total_carbs += nutrition['carbs']
            total_fat += nutrition['fat']

        return {
            'calories': round(total_calories, 2),
            'protein': round(total_protein, 2),
            'carbs': round(total_carbs, 2),
            'fat': round(total_fat, 2),
        }


class DietaryPattern(models.Model):
    """
    Dietary patterns that users can follow.
    Examples: vegetarian, vegan, keto, paleo, gluten-free, etc.
    """
    PATTERN_CHOICES = [
        ('vegetarian', 'Vegetarian'),
        ('vegan', 'Vegan'),
        ('keto', 'Keto'),
        ('paleo', 'Paleo'),
        ('gluten_free', 'Gluten-Free'),
        ('dairy_free', 'Dairy-Free'),
        ('pescatarian', 'Pescatarian'),
        ('halal', 'Halal'),
        ('kosher', 'Kosher'),
    ]
    
    name = models.CharField(max_length=50, choices=PATTERN_CHOICES, unique=True)
    description = models.TextField(blank=True)
    
    # Define which food categories are excluded for this pattern
    excluded_categories = models.ManyToManyField(
        FoodCategory, 
        blank=True, 
        related_name='excluded_in_patterns',
        help_text="Food categories that violate this dietary pattern"
    )
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.get_name_display()


class UserDietaryPreference(models.Model):
    """
    Links users to their dietary patterns.
    Users can have multiple dietary preferences.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dietary_preferences')
    pattern = models.ForeignKey(DietaryPattern, on_delete=models.CASCADE)
    custom_notes = models.TextField(blank=True, help_text="Optional custom dietary notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['user', 'pattern']]
        ordering = ['pattern__name']
    
    def __str__(self):
        return f"{self.user.username} - {self.pattern.get_name_display()}"


class UserAllergy(models.Model):
    """
    User allergies and intolerances.
    Can reference specific Food items or use text for allergens not in database.
    """
    SEVERITY_CHOICES = [
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='allergies')
    food = models.ForeignKey(
        Food, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        help_text="Specific food in database (if applicable)"
    )
    allergen_name = models.CharField(
        max_length=200,
        help_text="Name of allergen (required if food is not specified)"
    )
    severity = models.CharField(
        max_length=20, 
        choices=SEVERITY_CHOICES, 
        default='moderate',
        help_text="Severity of the allergy"
    )
    notes = models.TextField(blank=True, help_text="Additional notes about the allergy")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "User Allergies"
        ordering = ['allergen_name']
    
    def __str__(self):
        if self.food:
            return f"{self.user.username} - Allergic to {self.food.name}"
        return f"{self.user.username} - Allergic to {self.allergen_name}"


class UserFoodDislike(models.Model):
    """
    Foods that a user explicitly dislikes (not allergies, just preferences).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_dislikes')
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    reason = models.TextField(blank=True, help_text="Optional reason for disliking this food")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = [['user', 'food']]
        ordering = ['food__name']
    
    def __str__(self):
        return f"{self.user.username} dislikes {self.food.name}"