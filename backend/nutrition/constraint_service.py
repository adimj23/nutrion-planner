from django.contrib.auth.models import User
from django.db.models import Q
from .models import Food, UserDietaryPreference, UserAllergy, UserFoodDislike, FoodCategory, DietaryPattern


class ConstraintService:
    """
    Service class for querying allowed foods based on user constraints.
    Handles dietary patterns, allergies, and food dislikes.
    All constraint logic is centralized here, independent of meal generation.
    """
    
    @staticmethod
    def get_allowed_foods(user):
        """
        Get all foods that are allowed for a given user.
        Excludes foods that violate dietary patterns, allergies, or dislikes.
        
        Args:
            user: Django User instance
            
        Returns:
            QuerySet of Food objects that are allowed for the user
        """
        # Start with all foods
        allowed_foods = Food.objects.all()
        
        # Exclude foods based on dietary patterns
        dietary_preferences = UserDietaryPreference.objects.filter(user=user)
        for preference in dietary_preferences:
            pattern = preference.pattern
            # Get excluded categories for this pattern
            excluded_categories = pattern.excluded_categories.all()
            if excluded_categories:
                # Exclude foods that have any of the excluded categories
                allowed_foods = allowed_foods.exclude(categories__in=excluded_categories)
        
        # Exclude foods user is allergic to
        allergies = UserAllergy.objects.filter(user=user)
        allergic_food_ids = [allergy.food.id for allergy in allergies if allergy.food]
        if allergic_food_ids:
            allowed_foods = allowed_foods.exclude(id__in=allergic_food_ids)
        
        # Also check allergen names (for allergens not in database)
        allergen_names = [allergy.allergen_name.lower() for allergy in allergies]
        if allergen_names:
            # Exclude foods whose name contains any allergen name
            for allergen in allergen_names:
                allowed_foods = allowed_foods.exclude(name__icontains=allergen)
        
        # Exclude foods user dislikes
        disliked_foods = UserFoodDislike.objects.filter(user=user)
        disliked_food_ids = [dislike.food.id for dislike in disliked_foods]
        if disliked_food_ids:
            allowed_foods = allowed_foods.exclude(id__in=disliked_food_ids)
        
        return allowed_foods.distinct()
    
    @staticmethod
    def is_food_allowed(user, food):
        """
        Check if a specific food is allowed for a user.
        
        Args:
            user: Django User instance
            food: Food instance to check
            
        Returns:
            Boolean: True if food is allowed, False otherwise
        """
        allowed_foods = ConstraintService.get_allowed_foods(user)
        return allowed_foods.filter(id=food.id).exists()
    
    @staticmethod
    def get_excluded_foods(user):
        """
        Get all foods that are excluded for a user.
        
        Args:
            user: Django User instance
            
        Returns:
            QuerySet of Food objects that are excluded for the user
        """
        all_foods = Food.objects.all()
        allowed_foods = ConstraintService.get_allowed_foods(user)
        excluded_foods = all_foods.exclude(id__in=allowed_foods.values_list('id', flat=True))
        return excluded_foods
    
    @staticmethod
    def get_exclusion_reasons(user, food):
        """
        Get the reasons why a food is excluded for a user.
        
        Args:
            user: Django User instance
            food: Food instance to check
            
        Returns:
            List of strings explaining why the food is excluded
        """
        reasons = []
        
        # Check dietary patterns
        dietary_preferences = UserDietaryPreference.objects.filter(user=user)
        for preference in dietary_preferences:
            pattern = preference.pattern
            excluded_categories = pattern.excluded_categories.all()
            food_categories = food.categories.all()
            
            # Check if food has any category that's excluded by this pattern
            conflicting_categories = excluded_categories.filter(id__in=food_categories.values_list('id', flat=True))
            if conflicting_categories:
                category_names = [cat.get_name_display() for cat in conflicting_categories]
                reasons.append(
                    f"Violates {pattern.get_name_display()} diet (contains: {', '.join(category_names)})"
                )
        
        # Check allergies
        allergies = UserAllergy.objects.filter(user=user, food=food)
        for allergy in allergies:
            reasons.append(f"Allergic to {allergy.food.name} (severity: {allergy.get_severity_display()})")
        
        # Check allergen names in food name
        allergies_by_name = UserAllergy.objects.filter(user=user, food__isnull=True)
        for allergy in allergies_by_name:
            if allergy.allergen_name.lower() in food.name.lower():
                reasons.append(f"Contains allergen: {allergy.allergen_name} (severity: {allergy.get_severity_display()})")
        
        # Check dislikes
        dislikes = UserFoodDislike.objects.filter(user=user, food=food)
        for dislike in dislikes:
            reason_text = f"User dislikes this food"
            if dislike.reason:
                reason_text += f": {dislike.reason}"
            reasons.append(reason_text)
        
        return reasons
    
    @staticmethod
    def get_user_constraints_summary(user):
        """
        Get a summary of all constraints for a user.
        Useful for debugging and explainability.
        
        Args:
            user: Django User instance
            
        Returns:
            Dictionary with summary of user constraints
        """
        dietary_preferences = UserDietaryPreference.objects.filter(user=user)
        allergies = UserAllergy.objects.filter(user=user)
        dislikes = UserFoodDislike.objects.filter(user=user)
        
        return {
            'dietary_patterns': [
                {
                    'pattern': pref.pattern.get_name_display(),
                    'custom_notes': pref.custom_notes
                }
                for pref in dietary_preferences
            ],
            'allergies': [
                {
                    'food': allergy.food.name if allergy.food else None,
                    'allergen_name': allergy.allergen_name,
                    'severity': allergy.get_severity_display()
                }
                for allergy in allergies
            ],
            'dislikes': [
                {
                    'food': dislike.food.name,
                    'reason': dislike.reason
                }
                for dislike in dislikes
            ],
            'total_allowed_foods': ConstraintService.get_allowed_foods(user).count(),
            'total_excluded_foods': ConstraintService.get_excluded_foods(user).count(),
        }

