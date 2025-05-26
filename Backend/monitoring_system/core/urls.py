from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

# from .views import (
#     PlantViewSet, SensorViewSet,
#     EnergyConsumptionViewSet, ItemViewSet, SensorDataViewSet, AuthViewSet
# )

from .views import (
    AuthViewSet,PlantViewSet,SensorViewSet,ItemViewSet,SensorDataViewSet ,EnergyConsumptionViewSet
)

router = DefaultRouter()
router.register('plants', PlantViewSet,basename='plants')
router.register('sensors', SensorViewSet,basename='sensors')
router.register('energy', EnergyConsumptionViewSet , basename='energy')
router.register('items', ItemViewSet, basename='items')
router.register('sensor-data', SensorDataViewSet ,basename='sensor-data')
router.register('auth', AuthViewSet, basename='auth')  # 👈 Auth using ViewSet

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
