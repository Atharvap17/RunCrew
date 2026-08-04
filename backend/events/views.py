from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdminOrOrganizer
from registrations.models import Registration
from .models import Event
from .serializers import EventSerializer


class EventListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrOrganizer()]
        return [AllowAny()]

    def get(self, request):
        scope = request.query_params.get('scope')
        organizer_param = request.query_params.get('organizer')

        if (scope == 'mine' or organizer_param == 'me') and request.user.is_authenticated and getattr(request.user, 'role', None) == 'organizer':
            events = Event.objects.filter(organizer=request.user).order_by('date')
        else:
            events = Event.objects.all().order_by("date")

        featured = request.query_params.get('featured')
        status_filter = request.query_params.get('status')

        if featured == 'true':
            events = events.filter(is_featured=True)
        if status_filter:
            events = events.filter(status=status_filter)

        return Response(EventSerializer(events, many=True).data)

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(organizer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventDetailView(APIView):
    def get_permissions(self):
        if self.request.method in ("PUT", "DELETE"):
            return [IsAdminOrOrganizer()]
        return [AllowAny()]

    def get_object(self, pk):
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return None

    def get(self, request, pk):
        event = self.get_object(pk)
        if not event:
            return Response(
                {"error": "Event not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(EventSerializer(event).data)

    def put(self, request, pk):
        event = self.get_object(pk)

        if not event:
            return Response(
                {"error": "Event not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Only the organizer who owns the event can edit it
        if (
            request.user.role == "organizer"
            and event.organizer != request.user
        ):
            return Response(
                {"detail": "You don't have permission to edit this event."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EventSerializer(
            event,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        event = self.get_object(pk)

        if not event:
            return Response(
                {"error": "Event not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Only the organizer who owns the event can delete it
        if (
            request.user.role == "organizer"
            and event.organizer != request.user
        ):
            return Response(
                {"detail": "You don't have permission to delete this event."},
                status=status.HTTP_403_FORBIDDEN,
            )

        event.delete()

        return Response(
            {"message": "Event deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

class EventParticipantsView(APIView):
    permission_classes = [IsAdminOrOrganizer]

    def get(self, request, pk):
        registrations = Registration.objects.filter(event_id=pk).select_related('user')
        data = [
            {
                'registration_id': reg.id,
                'username': reg.user.username,
                'email': reg.user.email,
                'payment_status': reg.payment_status,
                'status': reg.status,
                'registered_at': reg.registered_at,
                'bib_number': reg.bib_number,
            }
            for reg in registrations
        ]
        return Response(data)
