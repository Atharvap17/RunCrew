from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from events.models import Event
from users.permissions import IsAdmin, IsAdminOrOrganizer
from .models import Registration
from .serializers import RegistrationSerializer


class RegistrationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'admin':
            registrations = Registration.objects.all().select_related('user', 'event')
        elif request.user.role == 'organizer':
            registrations = Registration.objects.filter(
                event__organizer=request.user,
            ).select_related('user', 'event')
        else:
            registrations = Registration.objects.filter(
                user=request.user,
            ).select_related('event')

        event_id = request.query_params.get('event')
        if event_id:
            registrations = registrations.filter(event_id=event_id)

        return Response(RegistrationSerializer(registrations, many=True).data)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        event_id = data.get('event')

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        if Registration.objects.filter(user=request.user, event=event).exists():
            return Response(
                {'error': 'Already registered for this event'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        current_participants = Registration.objects.filter(event=event).count()
        if current_participants >= event.max_participants:
            return Response({'error': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegistrationSerializer(data=data)
        if serializer.is_valid():
            registration = serializer.save(user=request.user)
            registration.bib_number = f"BIB{registration.id:04d}"
            registration.save()
            return Response(
                RegistrationSerializer(registration).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationDetailView(APIView):
    def get_permissions(self):
        if self.request.method in ('PUT', 'DELETE'):
            return [IsAdminOrOrganizer()]
        return [IsAuthenticated()]

    def get_object(self, pk, user):
        try:
            registration = Registration.objects.select_related('user', 'event').get(pk=pk)
            if user.role not in ('admin', 'organizer') and registration.user != user:
                return None
            return registration
        except Registration.DoesNotExist:
            return None

    def get(self, request, pk):
        registration = self.get_object(pk, request.user)
        if not registration:
            return Response({'error': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(RegistrationSerializer(registration).data)

    def put(self, request, pk):
        registration = self.get_object(pk, request.user)
        if not registration:
            return Response({'error': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RegistrationSerializer(registration, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        registration = self.get_object(pk, request.user)
        if not registration:
            return Response({'error': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ('admin', 'organizer') and registration.user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        registration.status = 'cancelled'
        registration.save()
        return Response({'message': 'Registration cancelled successfully'})


class CancelRegistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            registration = Registration.objects.get(pk=pk, user=request.user)
        except Registration.DoesNotExist:
            return Response({'error': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)

        if registration.payment_status == 'completed':
            return Response(
                {'error': 'Cannot cancel a paid registration. Contact support.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registration.status = 'cancelled'
        registration.save()
        return Response({'message': 'Registration cancelled successfully'})


