from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

# -----------------------
# Custom User Manager
# -----------------------
class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


# -----------------------
# Custom User Model
# -----------------------
class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='user')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def __str__(self):
        return self.email



# -----------------------
# Plant
# -----------------------
class Plant(models.Model):
    PLANT_TYPE_CHOICES = [
        ('recycling', 'Recycling Plant'),
        ('manufacturing', 'Manufacturing Plant'),
    ]

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    plant_type = models.CharField(max_length=50, choices=PLANT_TYPE_CHOICES)
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='plants')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.plant_type})"
    

# -----------------------
# Sensor
# -----------------------
class Sensor(models.Model):
    LOCATION_CHOICES = [
        ("input", "Input"),
        ("conveyer_belt", "Conveyer Belt"),
        ("weighing_machine", "Weighing Machine"),
        ("output_conveyer", "Output Conveyer"),
        ("output_weighing", "Output Weighing"),
    ]

    name = models.CharField(max_length=255)
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='sensors')
    location_type = models.CharField(max_length=50, choices=LOCATION_CHOICES)
    is_active = models.BooleanField(default=True)
    installed_at = models.DateTimeField(auto_now_add=True)
    last_maintenance = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_location_type_display()})"
    
# -----------------------
# Energy Consumption
# -----------------------
class EnergyConsumption(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='energy_consumptions')
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='energy_consumptions')
    timestamp = models.DateTimeField(default=timezone.now)
    energy_kwh = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.sensor.name} - {self.energy_kwh} kWh"
    

# -----------------------
# Item
# -----------------------
class Item(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

# -----------------------
# Sensor Data
# -----------------------
class SensorData(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='sensor_data')
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True, related_name='sensor_data')
    timestamp = models.DateTimeField(default=timezone.now)

    # Production Metrics
    items_scanned = models.PositiveIntegerField(default=0)
    items_processed = models.PositiveIntegerField(default=0)
    items_discarded = models.PositiveIntegerField(default=0)
    processed_with_errors = models.PositiveIntegerField(default=0)

    # Weight Metrics
    current_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Quality Metrics
    category_a = models.PositiveIntegerField(default=0)
    category_b = models.PositiveIntegerField(default=0)
    category_c = models.PositiveIntegerField(default=0)
    category_d = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_processed(self):
        return self.items_processed + self.processed_with_errors

    @property
    def total_output(self):
        return self.category_a + self.category_b + self.category_c + self.category_d

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.sensor.name} - {self.timestamp}"