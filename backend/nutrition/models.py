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