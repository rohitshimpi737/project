from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from  .models import SensorData, Sensor
from .serializers import SensorDataSerializer


class SensorDataViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        sensor_data = SensorData.objects.all()
        serializer = SensorDataSerializer(sensor_data, many=True)
        return Response(serializer.data)

    def create(self, request):
        request_data = request.data
        try:
            sensor = Sensor.objects.get(pk=request_data.get('sensor'))
            request_data['sensor'] = sensor  # Ensure only ID is passed
            sens_data = SensorData.objects.create(**request_data)
            serializer = SensorDataSerializer(sens_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Sensor.DoesNotExist:
            return Response({'error': 'Sensor not found'}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        sensor_data = SensorData.objects.filter(pk=pk).first()
        if not sensor_data:
            return Response({'error': 'Sensor data not found'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = SensorDataSerializer(sensor_data)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        sensor_data = SensorData.objects.filter(pk=pk).first()
        if not sensor_data:
            return Response({'error': 'Sensor data not found'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = request.data.copy()
            if 'sensor' in data:
                sensor = Sensor.objects.get(pk=data['sensor'])
                sensor_data.sensor = sensor  # Update sensor if provided
            for key, value in data.items():
                if key != 'sensor':  # Prevent full object update
                    setattr(sensor_data, key, value)

            sensor_data.save()
            serializer = SensorDataSerializer(sensor_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Sensor.DoesNotExist:
            return Response({'error': 'Sensor not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        sensor_data = SensorData.objects.filter(pk=pk).first()
        if not sensor_data:
            return Response({'error': 'Sensor data not found'}, status=status.HTTP_400_BAD_REQUEST)
        sensor_data.delete()
        return Response({'message': 'Sensor data deleted successfully'}, status=status.HTTP_200_OK)
