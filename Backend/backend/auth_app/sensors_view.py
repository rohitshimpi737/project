from rest_framework import viewsets, status
from django.contrib.auth import get_user_model 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Sensor, UserSensor
from .serializers import SensorSerializer, UserSensorSerializer
from django.db import IntegrityError

User = get_user_model()


class SensorViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        sensors = Sensor.objects.all()
        serializer = SensorSerializer(sensors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = SensorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        sensor = get_object_or_404(Sensor, pk=pk)
        serializer = SensorSerializer(sensor)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        sensor = get_object_or_404(Sensor, pk=pk)
        request.data.pop("added_ts", None)  # Ensure added_ts is not updated
        serializer = SensorSerializer(sensor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        sensor = get_object_or_404(Sensor, pk=pk)
        sensor.delete()
        return Response({"message": "Sensor deleted successfully"}, status=status.HTTP_200_OK)

class UserSensorViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user_sensors = UserSensor.objects.all()
        serializer = UserSensorSerializer(user_sensors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        user = get_object_or_404(User, pk=request.data.get("user"))
        sensor = get_object_or_404(Sensor, pk=request.data.get("sensor"))
        try:
            user_sensor = UserSensor.objects.create(user=user, sensor=sensor)
            serializer = UserSensorSerializer(user_sensor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(
                {"error": "User-Sensor mapping already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def retrieve(self, request, pk=None):
        user_sensor = get_object_or_404(UserSensor, pk=pk)
        serializer = UserSensorSerializer(user_sensor)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        user_sensor = get_object_or_404(UserSensor, pk=pk)
        try:
            user_sensor.user = get_object_or_404(User, pk=request.data.get("user"))
            user_sensor.sensor = get_object_or_404(Sensor, pk=request.data.get("sensor"))
            user_sensor.save()
            serializer = UserSensorSerializer(user_sensor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"error": "Cannot update details"}, status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, pk=None):
        user_sensor = get_object_or_404(UserSensor, pk=pk)
        user_sensor.delete()
        return Response(
            {"message": "User-Sensor mapping deleted successfully"},
            status=status.HTTP_200_OK,
        )
