from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password, make_password
from .models import CustomUser, Plant, Sensor, EnergyConsumption, Item, SensorData


# ------------------------
# User Serializer (for response)
# ------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'role', 'created_at']


# ------------------------
# Register Serializer
# ------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'role', 'password']

    # def validate(self, data):
    #     if data['password'] != data['confirm_password']:
    #         raise serializers.ValidationError({"password": "Passwords do not match"})
    #     return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user')
        )
        return user


# ------------------------
# Login Serializer
# ------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("User is inactive")

        return data


# ------------------------
# Update Profile Serializer (Optional if you want separate handling)
# ------------------------
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email']

class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'created_at')


class PlantSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # make user read-only
    class Meta:
        model = Plant
        fields = '__all__'


class SensorSerializer(serializers.ModelSerializer):
    plant = serializers.PrimaryKeyRelatedField(read_only=True)  # read-only; assigned automatically
    class Meta:
        model = Sensor
        fields = '__all__'


class EnergyConsumptionSerializer(serializers.ModelSerializer):
    sensor_name = serializers.CharField(source='sensor.name', read_only=True)
    plant_name = serializers.CharField(source='plant.name', read_only=True)

    class Meta:
        model = EnergyConsumption
        fields = [
            'id', 'sensor', 'sensor_name',
            'plant', 'plant_name',
            'timestamp', 'energy_kwh', 'cost',
            'created_at', 'updated_at'
        ]


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class SensorDataSerializer(serializers.ModelSerializer):
    sensor_name = serializers.CharField(source='sensor.name', read_only=True)
    plant_name = serializers.CharField(source='sensor.plant.name', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True, default=None)

    class Meta:
        model = SensorData
        fields = [
            'id',
            'sensor',         # still returns sensor_id
            'sensor_name',    # 👈 human-readable
            'plant_name',     # 👈 optional: plant name
            'item',           # item ID (nullable)
            'item_name',      # item name (nullable)
            'timestamp',
            'items_scanned',
            'items_processed',
            'items_discarded',
            'processed_with_errors',
            'current_weight_kg',
            'category_a',
            'category_b',
            'category_c',
            'category_d',
            'created_at',
            'updated_at',
        ]
