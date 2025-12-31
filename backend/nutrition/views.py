from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.contrib.auth.models import User
from .models import UserProfile, Food
from .serializers import UserSerializer, UserProfileSerializer, UserWithProfileSerializer, FoodSerializer

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
