from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import health_check, UserViewSet, UserProfileViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('health/', health_check),
    path('', include(router.urls)),
    # UserProfile endpoints nested under users
    path('users/<int:pk>/profile/', UserProfileViewSet.as_view({
        'post': 'create',
        'get': 'retrieve',
        'put': 'update'
    }), name='user-profile'),
]
