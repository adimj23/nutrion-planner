from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Food

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
