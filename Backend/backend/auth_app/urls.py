from django.urls import path
from .views import AuthViewSet
from .sensor_data_view import SensorDataViewSet
from .energy_view import EnergyConsumptionViewSet, UserEnergyLogViewSet
from .sensors_view import UserSensorViewSet , SensorViewSet

app_name = 'auth_app'  # Helps avoid URL conflicts in larger projects

urlpatterns = [
    path('register/', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('logout/', AuthViewSet.as_view({'post': 'logout'}), name='logout'),
    path('me/', AuthViewSet.as_view({'get': 'me'}), name='me'),
    path('profile/update/', AuthViewSet.as_view({'put': 'update_profile'}), name='update_profile'),
    path('reset_password/', AuthViewSet.as_view({'post': 'reset_password'}), name='reset_password'),
    path('google-auth/', AuthViewSet.as_view({'post': 'google_auth'}), name='google-auth'),

    # for sensor data
    path('sensor-data/get-all/', SensorDataViewSet.as_view({'get': 'list'}), name='get_all_sensor_data'),
    path('sensor-data/get/<int:pk>/', SensorDataViewSet.as_view({'get': 'retrieve'}), name='get_sensor_data'),
    path('sensor-data/create/', SensorDataViewSet.as_view({'post': 'create'}), name='create_sensor_data'),
    path('sensor-data/update/<int:pk>/', SensorDataViewSet.as_view({'patch': 'partial_update'}), name='update_sensor_data'),
    path('sensor-data/delete/<int:pk>/', SensorDataViewSet.as_view({'delete': 'destroy'}), name='delete_sensor_data'),


    # Sensor APIs
    path('sensor/get-all/', SensorViewSet.as_view({'get': 'list'}), name='get_all_sensors'),
    path('sensor/get/<int:pk>/', SensorViewSet.as_view({'get': 'retrieve'}), name='get_sensor'),
    path('sensor/create/', SensorViewSet.as_view({'post': 'create'}), name='create_sensor'),
    path('sensor/update/<int:pk>/', SensorViewSet.as_view({'patch': 'partial_update'}), name='update_sensor'),
    path('sensor/delete/<int:pk>/', SensorViewSet.as_view({'delete': 'destroy'}), name='delete_sensor'),

    # User-Sensor Mapping APIs
    path('user-sensor/get-all/', UserSensorViewSet.as_view({'get': 'list'}), name='get_all_user_sensors'),
    path('user-sensor/get/<int:pk>/', UserSensorViewSet.as_view({'get': 'retrieve'}), name='get_user_sensor'),
    path('user-sensor/create/', UserSensorViewSet.as_view({'post': 'create'}), name='create_user_sensor'),
    path('user-sensor/update/<int:pk>/', UserSensorViewSet.as_view({'patch': 'partial_update'}), name='update_user_sensor'),
    path('user-sensor/delete/<int:pk>/', UserSensorViewSet.as_view({'delete': 'destroy'}), name='delete_user_sensor'),


      # Energy Consumption APIs
    path('energy/get-all/', EnergyConsumptionViewSet.as_view({'get': 'list'}), name='get_all_energy'),
    path('energy/get/<int:pk>/', EnergyConsumptionViewSet.as_view({'get': 'retrieve'}), name='get_energy'),
    path('energy/create/', EnergyConsumptionViewSet.as_view({'post': 'create'}), name='create_energy'),
    path('energy/update/<int:pk>/', EnergyConsumptionViewSet.as_view({'patch': 'partial_update'}), name='update_energy'),
    path('energy/delete/<int:pk>/', EnergyConsumptionViewSet.as_view({'delete': 'destroy'}), name='delete_energy'),

    # User Energy Log APIs
    path('user-energy/get-all/', UserEnergyLogViewSet.as_view({'get': 'list'}), name='get_all_user_energy'),
    path('user-energy/get/<int:pk>/', UserEnergyLogViewSet.as_view({'get': 'retrieve'}), name='get_user_energy'),
    path('user-energy/create/', UserEnergyLogViewSet.as_view({'post': 'create'}), name='create_user_energy'),
    path('user-energy/update/<int:pk>/', UserEnergyLogViewSet.as_view({'patch': 'partial_update'}), name='update_user_energy'),
    path('user-energy/delete/<int:pk>/', UserEnergyLogViewSet.as_view({'delete': 'destroy'}), name='delete_user_energy'),
]