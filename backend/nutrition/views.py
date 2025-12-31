from django.shortcuts import render
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.contrib.auth.models import User
from .models import UserProfile, Food, Meal, MealPlan
from .serializers import (
    UserSerializer, UserProfileSerializer, UserWithProfileSerializer, 
    FoodSerializer, MealSerializer, MealPlanSerializer, GroceryListSerializer
)
from .services import MealPlanGenerator, GroceryListGenerator

# Create your views here.
@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"})

# ----------------------------
# User ViewSet
# ----------------------------
class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing, creating, and retrieving Users.
    """

    # List all users
    def list(self, request):
        users = User.objects.all()
        serializer = UserWithProfileSerializer(users, many=True)
        return Response(serializer.data)

    # Retrieve a single user by ID
    def retrieve(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserWithProfileSerializer(user)
        return Response(serializer.data)

    # Create a new user
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserWithProfileSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# UserProfile ViewSet
# ----------------------------
class UserProfileViewSet(viewsets.ViewSet):
    """
    ViewSet for UserProfile CRUD operations
    """

    # Create a profile for a user
    def create(self, request, pk=None):
        # Get user_id from URL parameter
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if profile already exists
        if UserProfile.objects.filter(user=user).exists():
            return Response({"detail": "Profile already exists for this user."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save(user=user)
            return Response(UserProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve profile by user ID
    def retrieve(self, request, pk=None):
        try:
            profile = UserProfile.objects.get(user__id=pk)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    # Update profile by user ID
    def update(self, request, pk=None):
        try:
            profile = UserProfile.objects.get(user__id=pk)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# Food ViewSet
# ----------------------------
class FoodViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Food CRUD operations.
    Provides list, create, retrieve, update, and destroy actions.
    """
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    
    def get_queryset(self):
        """
        Optionally filter foods by search query parameter.
        """
        queryset = Food.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset


# ----------------------------
# Meal ViewSet
# ----------------------------
class MealViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Meal CRUD operations.
    """
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    
    def get_queryset(self):
        """
        Optionally filter meals by meal_type.
        """
        queryset = Meal.objects.all()
        meal_type = self.request.query_params.get('meal_type', None)
        if meal_type:
            queryset = queryset.filter(meal_type=meal_type)
        return queryset


# ----------------------------
# MealPlan ViewSet
# ----------------------------
class MealPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for MealPlan CRUD operations.
    """
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
    
    def get_queryset(self):
        """
        Filter meal plans by user if user_id is provided.
        """
        queryset = MealPlan.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset
    
    @action(detail=False, methods=['post'], url_path='generate')
    def generate_meal_plan(self, request):
        """
        Generate a meal plan for a user based on their calorie targets.
        
        Expected POST data:
        {
            "user_id": 1,
            "num_days": 1  # optional, defaults to 1
        }
        """
        user_id = request.data.get('user_id')
        num_days = request.data.get('num_days', 1)
        
        if not user_id:
            return Response(
                {"detail": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            num_days = int(num_days)
            if num_days < 1 or num_days > 30:
                return Response(
                    {"detail": "num_days must be between 1 and 30."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except (ValueError, TypeError):
            return Response(
                {"detail": "num_days must be a valid integer."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            meal_plan = MealPlanGenerator.generate_meal_plan(user, num_days=num_days)
            serializer = MealPlanSerializer(meal_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": f"Error generating meal plan: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'], url_path='grocery-list')
    def get_grocery_list(self, request, pk=None):
        """
        Get the grocery list for a meal plan.
        Returns consolidated list of all foods needed with total quantities.
        """
        try:
            meal_plan = self.get_object()
        except MealPlan.DoesNotExist:
            return Response(
                {"detail": "Meal plan not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        grocery_items = GroceryListGenerator.generate_grocery_list(meal_plan)
        
        response_data = {
            'meal_plan_id': meal_plan.id,
            'items': grocery_items,
            'total_items': len(grocery_items)
        }
        
        serializer = GroceryListSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
