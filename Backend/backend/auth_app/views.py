from django.contrib.auth import get_user_model, authenticate
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer , GoogleAuthSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.hashers import check_password, make_password


User = get_user_model()

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    # @action(detail=False, methods=['post'])
    # def register(self, request):
    #     serializer = RegisterSerializer(data=request.data)
    #     if serializer.is_valid():
    #         user = serializer.save()
    #         refresh = RefreshToken.for_user(user)
    #         return Response({
    #             "user": UserSerializer(user).data,
    #             "access_token": str(refresh.access_token),
    #             "refresh_token": str(refresh)
    #         }, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Save the user without generating tokens
            return Response({
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)  # Use username=email
            
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

        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": getattr(user, 'is_staff', False) and "admin" or "user",
            "created_at": user.created_at
        }, status=status.HTTP_200_OK)


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
                    "role": user.groups.first().name if user.groups.exists() else "User",
                    "created_at": user.date_joined,
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def reset_password(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        new_password = "1234"
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password has been reset to '1234'."}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def google_auth(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)