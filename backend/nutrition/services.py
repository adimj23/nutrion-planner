from decimal import Decimal
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import UserProfile, Food, Meal, MealFood, MealPlan
from .constraint_service import ConstraintService


class MealPlanGenerator:
    """
    Service class for generating meal plans based on user's calorie targets.
    Uses a simple deterministic algorithm for MVP.
    """
    
    # Meal calorie distribution percentages
    BREAKFAST_PERCENT = Decimal('0.25')  # 25%
    LUNCH_PERCENT = Decimal('0.35')      # 35%
    DINNER_PERCENT = Decimal('0.40')     # 40%

    @staticmethod
    def generate_meal_plan(user, num_days=1):
        """
        Generate a meal plan for a user based on their calorie target.
        
        Args:
            user: Django User instance
            num_days: Number of days to generate meals for (default: 1)
        
        Returns:
            MealPlan instance
        """
        try:
            user_profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise ValueError("User must have a profile with calorie targets to generate a meal plan.")
        
        calorie_target = Decimal(str(user_profile.calorie_target))
        
        # Calculate calories per meal type (keep as Decimal for precision)
        breakfast_calories = calorie_target * MealPlanGenerator.BREAKFAST_PERCENT
        lunch_calories = calorie_target * MealPlanGenerator.LUNCH_PERCENT
        dinner_calories = calorie_target * MealPlanGenerator.DINNER_PERCENT
        
        # Get all available foods
        allowed_foods = list(ConstraintService.get_allowed_foods(user))
        if not allowed_foods:
            raise ValueError("No foods available in database. Please seed foods first.")
        
        # Create meals for each day
        created_meals = []
        
        for day in range(num_days):
            # Generate breakfast
            breakfast = MealPlanGenerator._create_meal(
                name=f"Breakfast Day {day + 1}",
                meal_type='breakfast',
                target_calories=breakfast_calories,
                available_foods=allowed_foods
            )
            created_meals.append(breakfast)
            
            # Generate lunch
            lunch = MealPlanGenerator._create_meal(
                name=f"Lunch Day {day + 1}",
                meal_type='lunch',
                target_calories=lunch_calories,
                available_foods=allowed_foods
            )
            created_meals.append(lunch)
            
            # Generate dinner
            dinner = MealPlanGenerator._create_meal(
                name=f"Dinner Day {day + 1}",
                meal_type='dinner',
                target_calories=dinner_calories,
                available_foods=allowed_foods
            )
            created_meals.append(dinner)
        
        # Create meal plan
        meal_plan = MealPlan.objects.create(user=user)
        meal_plan.meals.set(created_meals)
        
        return meal_plan

    @staticmethod
    def _create_meal(name, meal_type, target_calories, available_foods):
        """
        Create a single meal with foods that approximate the target calories.
        
        Args:
            name: Name of the meal
            meal_type: Type of meal (breakfast, lunch, dinner, snack)
            target_calories: Target calories for the meal
            available_foods: List of Food objects to choose from
        
        Returns:
            Meal instance
        """
        meal = Meal.objects.create(name=name, meal_type=meal_type)
        
        # Simple algorithm: select foods to approximate target calories
        # Try to include a protein, carb, and vegetable/fruit
        # Convert target_calories to Decimal for consistent calculations
        remaining_calories = Decimal(str(target_calories))
        foods_added = []
        
        # Categorize foods
        proteins = [f for f in available_foods if f.protein_per_100g > Decimal('15')]
        carbs = [f for f in available_foods if f.carbs_per_100g > Decimal('20')]
        vegetables = [f for f in available_foods if f.calories_per_100g < Decimal('100') and f.carbs_per_100g < Decimal('20')]
        
        # Add a protein source (if available)
        if proteins and remaining_calories > Decimal('100'):
            protein = proteins[0]  # Simple: take first available
            protein_calories = protein.calories_per_100g
            # Aim for 30-40% of meal calories from protein
            protein_portion_calories = min(remaining_calories * Decimal('0.4'), protein_calories * Decimal('2'))
            protein_quantity = (protein_portion_calories / protein_calories) * Decimal('100')
            
            MealFood.objects.create(
                meal=meal,
                food=protein,
                quantity_in_grams=protein_quantity.quantize(Decimal('0.01'))
            )
            foods_added.append(protein)
            remaining_calories -= protein_portion_calories
        
        # Add a carb source (if available)
        if carbs and remaining_calories > Decimal('50'):
            carb = carbs[0]  # Simple: take first available
            carb_calories = carb.calories_per_100g
            # Aim for 40-50% of remaining calories from carbs
            carb_portion_calories = min(remaining_calories * Decimal('0.5'), carb_calories * Decimal('2'))
            carb_quantity = (carb_portion_calories / carb_calories) * Decimal('100')
            
            MealFood.objects.create(
                meal=meal,
                food=carb,
                quantity_in_grams=carb_quantity.quantize(Decimal('0.01'))
            )
            foods_added.append(carb)
            remaining_calories -= carb_portion_calories
        
        # Add a vegetable (if available and calories remain)
        if vegetables and remaining_calories > Decimal('30'):
            vegetable = vegetables[0]  # Simple: take first available
            veg_calories = vegetable.calories_per_100g
            # Use remaining calories or reasonable portion
            veg_portion_calories = min(remaining_calories, veg_calories * Decimal('1.5'))
            veg_quantity = (veg_portion_calories / veg_calories) * Decimal('100')
            
            MealFood.objects.create(
                meal=meal,
                food=vegetable,
                quantity_in_grams=veg_quantity.quantize(Decimal('0.01'))
            )
            foods_added.append(vegetable)
            remaining_calories -= veg_portion_calories
        
        # If we're still far from target, add more food
        # Try to fill remaining calories with a balanced food
        if remaining_calories > Decimal('100'):
            # Find a food that hasn't been added yet
            unused_foods = [f for f in available_foods if f not in foods_added]
            if unused_foods:
                filler = unused_foods[0]
                filler_calories = filler.calories_per_100g
                filler_portion_calories = min(remaining_calories, filler_calories * Decimal('2'))
                filler_quantity = (filler_portion_calories / filler_calories) * Decimal('100')
                
                MealFood.objects.create(
                    meal=meal,
                    food=filler,
                    quantity_in_grams=filler_quantity.quantize(Decimal('0.01'))
                )
        
        return meal


class GroceryListGenerator:
    """
    Service class for generating grocery lists from meal plans.
    """
    
    @staticmethod
    def generate_grocery_list(meal_plan):
        """
        Generate a consolidated grocery list from all meals in the plan.
        Returns a list of dictionaries with food and total quantity.
        
        Args:
            meal_plan: MealPlan instance
        
        Returns:
            List of dictionaries with food details and total quantities
        """
        # Get all MealFood entries for meals in this plan
        meal_foods = MealFood.objects.filter(meal__in=meal_plan.meals.all())
        
        # Aggregate by food and sum quantities
        grocery_items = meal_foods.values('food').annotate(
            total_quantity=Sum('quantity_in_grams')
        ).order_by('food__name')
        
        # Build grocery list with food details
        grocery_list = []
        for item in grocery_items:
            food = Food.objects.get(pk=item['food'])
            total_quantity = item['total_quantity']
            
            # Calculate total nutrition for this quantity
            nutrition = food.calculate_nutrition(total_quantity)
            
            grocery_list.append({
                'food_id': food.id,
                'food_name': food.name,
                'total_quantity_grams': float(total_quantity),
                'nutrition': nutrition,
            })
        
        return grocery_list

