from rest_framework import serializers
from django.contrib.auth.models import User
from decimal import Decimal
from .models import (
    UserProfile, Food, Meal, MealFood, MealPlan,
    FoodCategory, DietaryPattern, UserDietaryPreference, UserAllergy, UserFoodDislike
)
from .calorie_calculator import CalorieCalculator

class UserSerializer(serializers.ModelSerializer):
    # Make password write-only
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Use Django's create_user to hash password
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    # Computed fields for display
    bmr = serializers.SerializerMethodField()
    tdee = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'age', 'gender', 'height', 'weight', 'activity_level',
            'weight_goal_type', 'goal_weight', 'weight_change_per_week',
            'calorie_target', 'protein_target', 'carb_target', 'fat_target',
            'bmr', 'tdee',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'bmr', 'tdee']
    
    def get_bmr(self, obj):
        """Calculate and return BMR."""
        return CalorieCalculator.calculate_bmr(
            obj.weight, obj.height, obj.age, obj.gender
        )
    
    def get_tdee(self, obj):
        """Calculate and return TDEE."""
        bmr = CalorieCalculator.calculate_bmr(
            obj.weight, obj.height, obj.age, obj.gender
        )
        return CalorieCalculator.calculate_tdee(bmr, obj.activity_level)
    
    def validate_age(self, value):
        if value < 1 or value > 150:
            raise serializers.ValidationError("Age must be between 1 and 150.")
        return value
    
    def validate_height(self, value):
        if value <= 0 or value > 300:
            raise serializers.ValidationError("Height must be between 0 and 300 in.")
        return value
    
    def validate_weight(self, value):
        if value <= 0 or value > 1000:
            raise serializers.ValidationError("Weight must be between 0 and 1000 lbs.")
        return value
    
    def validate_weight_change_per_week(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("Weight change per week should be between 0 and 5 lbs.")
        return value
    
    def validate(self, data):
        """Auto-calculate calorie and macro targets if key fields are provided."""
        # Get existing values or new values
        weight = data.get('weight', getattr(self.instance, 'weight', None) if self.instance else None)
        height = data.get('height', getattr(self.instance, 'height', None) if self.instance else None)
        age = data.get('age', getattr(self.instance, 'age', None) if self.instance else None)
        gender = data.get('gender', getattr(self.instance, 'gender', 'male') if self.instance else 'male')
        activity_level = data.get('activity_level', getattr(self.instance, 'activity_level', None) if self.instance else None)
        weight_goal_type = data.get('weight_goal_type', getattr(self.instance, 'weight_goal_type', 'maintain') if self.instance else 'maintain')
        weight_change_per_week = data.get('weight_change_per_week', getattr(self.instance, 'weight_change_per_week', Decimal('0.5')) if self.instance else Decimal('0.5'))
        
        # Only calculate if we have the minimum required fields
        if weight and height and age and activity_level:
            # Calculate targets
            targets = CalorieCalculator.calculate_all_targets(
                weight, height, age, gender, activity_level,
                weight_goal_type, weight_change_per_week
            )
            
            # Auto-set calorie target if not explicitly provided
            if 'calorie_target' not in data or data.get('calorie_target') is None:
                data['calorie_target'] = targets['calorie_target']
            
            # Auto-calculate macros if not explicitly provided
            if 'protein_target' not in data or data.get('protein_target') is None:
                macros = CalorieCalculator.calculate_macro_targets(targets['calorie_target'])
                data['protein_target'] = Decimal(str(macros['protein_target']))
                data['carb_target'] = Decimal(str(macros['carb_target']))
                data['fat_target'] = Decimal(str(macros['fat_target']))
        
        return data

class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)
    dietary_preferences = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'dietary_preferences']
    
    def get_dietary_preferences(self, obj):
        preferences = UserDietaryPreference.objects.filter(user=obj)
        return UserDietaryPreferenceSerializer(preferences, many=True).data


class FoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']


class FoodSerializer(serializers.ModelSerializer):
    categories = FoodCategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=FoodCategory.objects.all(),
        source='categories',
        many=True,
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Food
        fields = [
            'id', 'name', 'calories_per_100g', 'protein_per_100g', 
            'carbs_per_100g', 'fat_per_100g', 'fiber_per_100g', 
            'sugar_per_100g', 'categories', 'category_ids',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_calories_per_100g(self, value):
        if value < 0:
            raise serializers.ValidationError("Calories cannot be negative.")
        if value > 1000:
            raise serializers.ValidationError("Calories per 100g should be reasonable (max 1000).")
        return value
    
    def validate_protein_per_100g(self, value):
        if value < 0:
            raise serializers.ValidationError("Protein cannot be negative.")
        if value > 100:
            raise serializers.ValidationError("Protein per 100g should be reasonable (max 100g).")
        return value
    
    def validate_carbs_per_100g(self, value):
        if value < 0:
            raise serializers.ValidationError("Carbs cannot be negative.")
        if value > 100:
            raise serializers.ValidationError("Carbs per 100g should be reasonable (max 100g).")
        return value
    
    def validate_fat_per_100g(self, value):
        if value < 0:
            raise serializers.ValidationError("Fat cannot be negative.")
        if value > 100:
            raise serializers.ValidationError("Fat per 100g should be reasonable (max 100g).")
        return value
    
    def validate_fiber_per_100g(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Fiber cannot be negative.")
        return value
    
    def validate_sugar_per_100g(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Sugar cannot be negative.")
        return value


class MealFoodSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.PrimaryKeyRelatedField(
        queryset=Food.objects.all(), 
        source='food', 
        write_only=True
    )

    class Meta:
        model = MealFood
        fields = ['id', 'food', 'food_id', 'quantity_in_grams', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_quantity_in_grams(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be positive.")
        if value > 10000:
            raise serializers.ValidationError("Quantity seems unreasonably large (max 10000g).")
        return value


class MealSerializer(serializers.ModelSerializer):
    foods = MealFoodSerializer(source='mealfood_set', many=True, read_only=True)
    total_nutrition = serializers.SerializerMethodField()

    class Meta:
        model = Meal
        fields = [
            'id', 'name', 'meal_type', 'foods', 'total_nutrition',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_nutrition']

    def get_total_nutrition(self, obj):
        return obj.calculate_total_nutrition()

    def create(self, validated_data):
        foods_data = self.initial_data.get('foods', [])
        meal = Meal.objects.create(**validated_data)
        
        for food_data in foods_data:
            MealFood.objects.create(
                meal=meal,
                food_id=food_data.get('food_id'),
                quantity_in_grams=food_data.get('quantity_in_grams')
            )
        
        return meal

    def update(self, instance, validated_data):
        foods_data = self.initial_data.get('foods', None)
        
        instance.name = validated_data.get('name', instance.name)
        instance.meal_type = validated_data.get('meal_type', instance.meal_type)
        instance.save()
        
        if foods_data is not None:
            # Clear existing foods
            MealFood.objects.filter(meal=instance).delete()
            # Add new foods
            for food_data in foods_data:
                MealFood.objects.create(
                    meal=instance,
                    food_id=food_data.get('food_id'),
                    quantity_in_grams=food_data.get('quantity_in_grams')
                )
        
        return instance


class MealPlanSerializer(serializers.ModelSerializer):
    meals = MealSerializer(many=True, read_only=True)
    meal_ids = serializers.PrimaryKeyRelatedField(
        queryset=Meal.objects.all(),
        source='meals',
        many=True,
        write_only=True,
        required=False
    )
    total_nutrition = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = MealPlan
        fields = [
            'id', 'user', 'meals', 'meal_ids', 'start_date', 'end_date',
            'total_nutrition', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_nutrition']

    def get_total_nutrition(self, obj):
        return obj.calculate_total_nutrition()


class GroceryItemSerializer(serializers.Serializer):
    """Serializer for grocery list items (not a model)."""
    food_id = serializers.IntegerField()
    food_name = serializers.CharField()
    total_quantity_grams = serializers.FloatField()
    nutrition = serializers.DictField()


class GroceryListSerializer(serializers.Serializer):
    """Serializer for the full grocery list response."""
    meal_plan_id = serializers.IntegerField()
    items = GroceryItemSerializer(many=True)
    total_items = serializers.IntegerField()


# Constraint-related serializers

class DietaryPatternSerializer(serializers.ModelSerializer):
    excluded_categories = FoodCategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = DietaryPattern
        fields = ['id', 'name', 'description', 'excluded_categories']
        read_only_fields = ['id']


class UserDietaryPreferenceSerializer(serializers.ModelSerializer):
    pattern = DietaryPatternSerializer(read_only=True)
    pattern_id = serializers.PrimaryKeyRelatedField(
        queryset=DietaryPattern.objects.all(),
        source='pattern',
        write_only=True
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = UserDietaryPreference
        fields = [
            'id', 'user', 'pattern', 'pattern_id', 'custom_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class UserAllergySerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True, required=False)
    food_id = serializers.PrimaryKeyRelatedField(
        queryset=Food.objects.all(),
        source='food',
        write_only=True,
        required=False,
        allow_null=True
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = UserAllergy
        fields = [
            'id', 'user', 'food', 'food_id', 'allergen_name', 'severity', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Ensure either food or allergen_name is provided
        if not data.get('food') and not data.get('allergen_name'):
            raise serializers.ValidationError(
                "Either food_id or allergen_name must be provided."
            )
        return data


class UserFoodDislikeSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.PrimaryKeyRelatedField(
        queryset=Food.objects.all(),
        source='food',
        write_only=True
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = UserFoodDislike
        fields = ['id', 'user', 'food', 'food_id', 'reason', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class UserConstraintsSummarySerializer(serializers.Serializer):
    """Serializer for user constraints summary (from ConstraintService)."""
    dietary_patterns = serializers.ListField()
    allergies = serializers.ListField()
    dislikes = serializers.ListField()
    total_allowed_foods = serializers.IntegerField()
    total_excluded_foods = serializers.IntegerField()
