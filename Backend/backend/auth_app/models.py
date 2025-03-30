from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from datetime import datetime

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='user')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    # plant location 

    # Required fields
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()  # Add custom manager

    def __str__(self):
        return self.email
    
# ✅ Energy Consumption Model
class EnergyConsumption(models.Model):
    id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=255)
    energy_consumed_kwh = models.DecimalField(max_digits=10, decimal_places=2)
    updated_ts = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.updated_ts = datetime.now()
        super().save(*args, **kwargs)



# ✅ Sensor Model
class Sensor(models.Model):
    sensor_id = models.AutoField(primary_key=True)
    sensor_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    purchased_on = models.DateTimeField(null=True, blank=True)
    warranty_till = models.DateTimeField(null=True, blank=True)
    remark = models.CharField(max_length=255, null=True, blank=True)
    added_ts = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_ts = models.DateTimeField(auto_now=True, null=True, blank=True)  # Auto update
    status = models.CharField(max_length=50, default="active")

    def save(self, *args, **kwargs):
        self.updated_ts = datetime.now()
        super().save(*args, **kwargs)


# ✅ User Sensor Mapping
class UserSensor(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Updated to use CustomUser
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_ts = models.DateTimeField(null=True, blank=True)
    # locaion where the sensor is installed 

    class Meta:
        unique_together = ("user", "sensor")

    def save(self, *args, **kwargs):
        self.updated_ts = datetime.now()
        super().save(*args, **kwargs)


# ✅ User Energy Log
class UserEnergyLog(models.Model):
    id = models.AutoField(primary_key=True)
    # user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Updated to use CustomUser
    # link to user_id 
    energy = models.ForeignKey(EnergyConsumption, on_delete=models.CASCADE)
    recorded_at = models.DateTimeField(auto_now_add=True)
    updated_ts = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.updated_ts = datetime.now()
        super().save(*args, **kwargs)


# ✅ Sensor Data Model
class SensorData(models.Model):
    id = models.AutoField(primary_key=True)
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(null=True, blank=True)
    
    LOCATION_CHOICES = [
        ("input", "input"),
        ("conveyer_belt", "conveyer_belt"),
        ("weighing_machine", "weighing_machine"),
        ("output_conveyer", "output_conveyer"),
        ("output_weighing", "output_weighing"),
    ]

    location_type = models.CharField(max_length=50, choices=LOCATION_CHOICES)

    # Processing Details

    items_scanned = models.IntegerField(default=0)
    items_discarded = models.IntegerField(default=0)
    items_processed = models.IntegerField(default=0)
    processed_with_error = models.IntegerField(default=0)
    hourly_processed = models.IntegerField(default=0)
    discarded_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Vehicle Weights
    weight_full_vehicle = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    weight_empty_vehicle = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Categories
    category_A = models.IntegerField(default=0)
    category_B = models.IntegerField(default=0)
    category_C = models.IntegerField(default=0)
    category_D = models.IntegerField(default=0)

    # Remarks & Sensed Data 
    remark = models.TextField(null=True, blank=True)
    sensed_data = models.CharField(max_length=250, null=True, blank=True)

    updated_ts = models.DateTimeField(auto_now=True, null=True, blank=True)  # Auto-update timestamp

    @property
    def total_processed(self):
        return self.items_processed + self.processed_with_error

    @property
    def total_output(self):
        return self.category_A + self.category_B + self.category_C + self.category_D
    

# ✅ Plant Model associated with user
class Plant(models.Model):
    id = models.AutoField(primary_key=True)
    plant_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Updated to use CustomUser
    added_ts = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_ts = models.DateTimeField(auto_now=True, null=True, blank=True)  # Auto update
    plant_type = models.CharField(max_length=255, null=True, blank=True)  # New field for plant type
    sensor = models.ForeignKey(SensorData, on_delete=models.CASCADE)  # Use string reference for SensorData
    # energy consumption associated with plant
    # // map sensor to plant
    
    def save(self, *args, **kwargs):
        self.updated_ts = datetime.now()
        super().save(*args, **kwargs)