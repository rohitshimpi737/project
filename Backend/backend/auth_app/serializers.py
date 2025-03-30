from rest_framework import serializers
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from google.auth.exceptions import GoogleAuthError  # Specific exception import
import os
import logging
from django.conf import settings

from .models import Sensor, UserSensor, EnergyConsumption, UserEnergyLog, CustomUser, SensorData

User = CustomUser  # Update the user model reference
logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'created_at')
        read_only_fields = ('id', 'created_at')  # Prevent modification

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        """Ensure email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """Ensure username is unique"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True, style={'input_type': 'password'},
        trim_whitespace=False
    )  # Hide input



class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

# Serializer for UserSensor
class UserSensorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    sensor = SensorSerializer()
    class Meta:
        model = UserSensor
        fields = '__all__'

        
class EnergyConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyConsumption
        fields = '__all__'

class UserEnergyLogSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    energy = EnergyConsumptionSerializer()

    class Meta:
        model = UserEnergyLog
        fields = '__all__'

class SensorDataSerializer(serializers.ModelSerializer):
    sensor = SensorSerializer()
    class Meta:
        model = SensorData
        fields = '__all__'
        
class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate_token(self, value):
        try:
            # Verify Google token
            google_oauth2_key = os.getenv('GOOGLE_OAUTH2_KEY', settings.GOOGLE_OAUTH2_KEY)
            google_info = id_token.verify_oauth2_token(
                value, 
                requests.Request(), 
                google_oauth2_key
            )

            email = google_info.get("email")
            if not email:
                raise serializers.ValidationError("Email not provided by Google")

            # Generate unique username
            base_username = google_info.get("name", "user").replace(" ", "_").lower()[:25]
            username = self.generate_unique_username(base_username)

            # Create or update user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'password': make_password(None),  # Set unusable password
                    'is_active': True
                }
            )

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return {
                "user": UserSerializer(user).data,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }

        except GoogleAuthError as e:
            raise serializers.ValidationError("Invalid Google token") from e
        except Exception as e:
            logger.error(f"Google auth error: {str(e)}")
            raise serializers.ValidationError("Authentication failed") from e

    def generate_unique_username(self, base_username):
        """
        Generates unique username by appending numbers if needed
        Example: john_doe, john_doe1, john_doe2
        """
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        return username