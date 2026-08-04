from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdminOrOrganizer
from .models import RaceResult
from .serializers import RaceResultSerializer


class RaceResultListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrOrganizer()]
        return [AllowAny()]

    def get(self, request):
        if request.user.role == 'admin':
            results = RaceResult.objects.select_related(
                'registration__user',
                'registration__event',
            ).order_by('rank')
        elif request.user.role == 'organizer':
            results = RaceResult.objects.filter(
                registration__event__organizer=request.user,
            ).select_related(
                'registration__user',
                'registration__event',
            ).order_by('rank')
        else:
            results = RaceResult.objects.select_related(
                'registration__user',
                'registration__event',
            ).order_by('rank')

        event_id = request.query_params.get('event')
        user_id = request.query_params.get('user')

        if event_id:
            results = results.filter(registration__event_id=event_id)
        if user_id:
            results = results.filter(registration__user_id=user_id)

        return Response(RaceResultSerializer(results, many=True).data)

    def post(self, request):
        serializer = RaceResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RaceResultDetailView(APIView):
    permission_classes = [IsAdminOrOrganizer]

    def get_object(self, pk):
        try:
            return RaceResult.objects.get(pk=pk)
        except RaceResult.DoesNotExist:
            return None

    def get(self, request, pk):
        result = self.get_object(pk)
        if not result:
            return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(RaceResultSerializer(result).data)

    def put(self, request, pk):
        result = self.get_object(pk)
        if not result:
            return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RaceResultSerializer(result, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        result = self.get_object(pk)
        if not result:
            return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)
        result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
