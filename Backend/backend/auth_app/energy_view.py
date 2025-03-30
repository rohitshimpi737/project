from rest_framework import viewsets, permissions, status
from django.contrib.auth import get_user_model, authenticate
from rest_framework.response import Response
from django.db import IntegrityError
from .models import EnergyConsumption, UserEnergyLog
from .serializers import EnergyConsumptionSerializer, UserEnergyLogSerializer

User = get_user_model()

class EnergyConsumptionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        energy_logs = EnergyConsumption.objects.all()
        serializer = EnergyConsumptionSerializer(energy_logs, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = EnergyConsumptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        energy_log = EnergyConsumption.objects.filter(pk=pk).first()
        if not energy_log:
            return Response({'error': 'Energy consumption record not found'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EnergyConsumptionSerializer(energy_log)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        energy_log = EnergyConsumption.objects.filter(pk=pk).first()
        if not energy_log:
            return Response({'error': 'Energy consumption record not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.data.pop('timestamp', None)  # Prevent modifying timestamp
        serializer = EnergyConsumptionSerializer(energy_log, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        energy_log = EnergyConsumption.objects.filter(pk=pk).first()
        if not energy_log:
            return Response({'error': 'Energy consumption record not found'}, status=status.HTTP_400_BAD_REQUEST)
        energy_log.delete()
        return Response({'message': 'Energy consumption record deleted successfully'}, status=status.HTTP_200_OK)


class UserEnergyLogViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        energy_logs = UserEnergyLog.objects.all()
        serializer = UserEnergyLogSerializer(energy_logs, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            user = User.objects.get(pk=request.data.get('user'))
            energy = EnergyConsumption.objects.get(pk=request.data.get('energy'))
            user_energy_log = UserEnergyLog.objects.create(user=user, energy=energy)
            serializer = UserEnergyLogSerializer(user_energy_log)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except (User.DoesNotExist, EnergyConsumption.DoesNotExist):
            return Response({'error': 'Invalid user or energy ID'}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        energy_log = UserEnergyLog.objects.filter(pk=pk).first()
        if not energy_log:
            return Response({'error': 'User energy log not found'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserEnergyLogSerializer(energy_log)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        try:
            energy_log = UserEnergyLog.objects.get(pk=pk)
            user = User.objects.get(pk=request.data.get('user'))
            energy = EnergyConsumption.objects.get(pk=request.data.get('energy'))

            energy_log.user = user
            energy_log.energy = energy
            energy_log.save()

            serializer = UserEnergyLogSerializer(energy_log)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except (UserEnergyLog.DoesNotExist, User.DoesNotExist, EnergyConsumption.DoesNotExist):
            return Response({'error': 'Invalid user, energy, or log ID'}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({'error': 'Database integrity error'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        energy_log = UserEnergyLog.objects.filter(pk=pk).first()
        if not energy_log:
            return Response({'error': 'User energy log not found'}, status=status.HTTP_400_BAD_REQUEST)
        energy_log.delete()
        return Response({'message': 'User energy log deleted successfully'}, status=status.HTTP_200_OK)
