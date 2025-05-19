from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import ValidationError

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password, make_password

from .models import CustomUser, Plant, Sensor
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UpdateProfileSerializer,
    PlantSerializer,
    SensorSerializer,
    MeSerializer
)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  
            return Response({
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)  
            
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "user": UserSerializer(user).data,
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh)
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = MeSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    

    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        try:
            user = request.user
            data = request.data

            # Update profile details
            username = data.get("username")
            email = data.get("email")
            if username:
                user.username = username
            if email:
                user.email = email
            user.save()

            # Handle password change
            current_password = data.get("currentPassword")
            new_password = data.get("newPassword")
            confirm_password = data.get("confirmPassword")

            if current_password and new_password:
                if not check_password(current_password, user.password):
                    return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
                if new_password != confirm_password:
                    return Response({"error": "New passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

                user.password = make_password(new_password)
                user.save()

            return Response({
                "message": "Profile updated successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "created_at": user.created_at,
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    
# -------------------------
# Plant ViewSet
# -------------------------
class PlantViewSet(viewsets.ModelViewSet):
    serializer_class = PlantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Plant.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# -------------------------
# Sensor ViewSet
# -------------------------
class SensorViewSet(viewsets.ModelViewSet):
    serializer_class = SensorSerializer
    permission_classes = [permissions.IsAuthenticated]

    # def get_queryset(self):
    #     # return Sensor.objects.filter(plant__user=self.request.user)
    #     queryset = Sensor.objects.filter(plant__user=self.request.user)
    #     plant_id = self.request.query_params.get("plant")
    #     if plant_id:
    #         queryset = queryset.filter(plant_id=plant_id)
    #     return queryset

    def get_queryset(self):
        queryset = Sensor.objects.filter(plant__user=self.request.user)

        plant_id = self.request.query_params.get("plant")
        if plant_id:
            queryset = queryset.filter(plant_id=plant_id)

        status_filter = self.request.query_params.get("status")  # expects "active" or "inactive"
        if status_filter == "active":
            queryset = queryset.filter(is_active=True)
        elif status_filter == "inactive":
            queryset = queryset.filter(is_active=False)

        return queryset


    def perform_create(self, serializer):
        plant_id = self.request.data.get('plant')
        if not plant_id:
            raise ValidationError({"plant": "This field is required."})

        try:
            plant = Plant.objects.get(id=plant_id, user=self.request.user)
        except Plant.DoesNotExist:
            raise ValidationError({"plant": "Invalid plant or not owned by you."})

        serializer.save(plant=plant)