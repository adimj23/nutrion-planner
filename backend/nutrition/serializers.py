from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Food, Meal, MealFood, MealPlan

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
    class Meta:
        model = UserProfile
        fields = [
            'id', 'age', 'height', 'weight', 'activity_level',
            'calorie_target', 'protein_target', 'carb_target', 'fat_target',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_age(self, value):
        if value < 1 or value > 150:
            raise serializers.ValidationError("Age must be between 1 and 150.")
        return value
    
    def validate_height(self, value):
        if value <= 0 or value > 300:
            raise serializers.ValidationError("Height must be between 0 and 120 in.")
        return value
    
    def validate_weight(self, value):
        if value <= 0 or value > 1000:
            raise serializers.ValidationError("Weight must be between 0 and 1000 lbs.")
        return value

class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = [
            'id', 'name', 'calories_per_100g', 'protein_per_100g', 
            'carbs_per_100g', 'fat_per_100g', 'fiber_per_100g', 
            'sugar_per_100g', 'created_at', 'updated_at'
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
