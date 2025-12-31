from django.db import models
from django.contrib.auth.models import User

# Create your models here.

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def calculate_nutrition(self, quantity_grams):
        """
        Calculate nutrition for a given quantity in grams.
        Returns a dictionary with all nutritional values.
        """
        multiplier = quantity_grams / 100.0
        return {
            'calories': float(self.calories_per_100g * multiplier),
            'protein': float(self.protein_per_100g * multiplier),
            'carbs': float(self.carbs_per_100g * multiplier),
            'fat': float(self.fat_per_100g * multiplier),
            'fiber': float(self.fiber_per_100g * multiplier) if self.fiber_per_100g else None,
            'sugar': float(self.sugar_per_100g * multiplier) if self.sugar_per_100g else None,
        }