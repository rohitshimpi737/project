from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from datetime import datetime


from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password, make_password

from .models import CustomUser, Plant, Sensor,Item, SensorData
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UpdateProfileSerializer,
    PlantSerializer,
    SensorSerializer,
    MeSerializer,
    ItemSerializer,
    SensorDataSerializer,
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



# -------------------------
# Item ViewSet
# -------------------------
class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Item.objects.filter(plant__user=self.request.user)
        plant_id = self.request.query_params.get("plant")
        if plant_id:
            queryset = queryset.filter(plant_id=plant_id)
        return queryset

    def perform_create(self, serializer):
        plant_id = self.request.data.get('plant')
        if not plant_id:
            raise ValidationError({"plant": "This field is required."})
        try:
            plant = Plant.objects.get(id=plant_id, user=self.request.user)
        except Plant.DoesNotExist:
            raise ValidationError({"plant": "Invalid or unauthorized plant"})
        serializer.save(plant=plant)

# -------------------------
# SensorData ViewSet
# -------------------------
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class SensorDataViewSet(viewsets.ModelViewSet):
    serializer_class = SensorDataSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def parse_date_safe(self, date_str):
        dt = parse_datetime(date_str)
        if not dt:
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                return None
        return timezone.make_aware(dt) if timezone.is_naive(dt) else dt

    def get_queryset(self):
        qs = SensorData.objects.filter(sensor__plant__user=self.request.user)
        params = self.request.query_params

        sensor_id = params.get("sensor") or params.get("sensor_id")
        plant_id = params.get("plant") or params.get("plant_id")
        item_id = params.get("item") or params.get("item_id")
        start = params.get("start") or params.get("start_date")
        end = params.get("end") or params.get("end_date")
        date_filter = params.get("date_filter")  # today, week, month
        categories = params.getlist("category")

        # Safe parsing
        if isinstance(start, str):
            start = self.parse_date_safe(start)
        if isinstance(end, str):
            end = self.parse_date_safe(end)
            if end:
                # Extend end to end of day
                end = end.replace(hour=23, minute=59, second=59, microsecond=999999)

        now = timezone.now()
        if not start and date_filter == "today":
            start = now.replace(hour=0, minute=0, second=0)
        elif not start and date_filter == "week":
            start = now - timedelta(days=7)
        elif not start and date_filter == "month":
            start = now - timedelta(days=30)

        if start and timezone.is_naive(start):
            start = timezone.make_aware(start)
        if end and timezone.is_naive(end):
            end = timezone.make_aware(end)

        if plant_id and not sensor_id:
            qs = qs.filter(sensor__plant_id=plant_id)
        elif sensor_id:
            qs = qs.filter(sensor_id=sensor_id)
            if plant_id:
                qs = qs.filter(sensor__plant_id=plant_id)

        if item_id:
            qs = qs.filter(item_id=item_id)
        if start:
            qs = qs.filter(timestamp__gte=start)
        if end:
            qs = qs.filter(timestamp__lte=end)

        cat_fields = {
            "A": "category_a__gt",
            "B": "category_b__gt",
            "C": "category_c__gt",
            "D": "category_d__gt"
        }
        filter_map = {cat_fields[c]: 0 for c in categories if c in cat_fields}
        if filter_map:
            qs = qs.filter(**filter_map)

        return qs.order_by("-timestamp")

    def perform_create(self, serializer):
        sensor_id = self.request.data.get("sensor")
        if not sensor_id:
            raise ValidationError({"sensor": "Sensor ID is required"})

        try:
            sensor = Sensor.objects.get(id=sensor_id, plant__user=self.request.user)
        except Sensor.DoesNotExist:
            raise ValidationError({"sensor": "Invalid sensor or not owned by you"})

        serializer.save(sensor=sensor)

    @action(detail=False, methods=['get'], url_path='metrics')
    def get_metrics(self, request):
        metric_type = request.query_params.get("metric")
        qs = self.get_queryset()

        if metric_type == "production":
            data = qs.values("timestamp", "items_scanned", "items_processed", "items_discarded", "processed_with_errors")
        elif metric_type == "weight":
            data = qs.values("timestamp", "current_weight_kg")
        elif metric_type == "quality":
            data = qs.values("timestamp", "category_a", "category_b", "category_c", "category_d")
        else:
            return Response({"error": "Invalid metric"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data, status=status.HTTP_200_OK)
