from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from events.models import Event
from payments.models import Payment
from registrations.models import Registration
from results.models import RaceResult
from users.models import User
from users.permissions import IsAdminOrOrganizer


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrOrganizer]

    def get(self, request):
        total_revenue = Payment.objects.filter(
            status='completed',
        ).aggregate(total=Sum('amount'))['total'] or 0

        recent_registrations = Registration.objects.select_related(
            'user', 'event',
        ).order_by('-registered_at')[:5]

        return Response({
            'total_users': User.objects.count(),
            'total_events': Event.objects.count(),
            'total_registrations': Registration.objects.count(),
            'total_payments': Payment.objects.filter(status='completed').count(),
            'total_revenue': total_revenue,
            'total_results': RaceResult.objects.count(),
            'upcoming_events': Event.objects.filter(status='upcoming').count(),
            'recent_registrations': [
                {
                    'id': r.id,
                    'user': r.user.username,
                    'event': r.event.title,
                    'status': r.status,
                    'payment_status': r.payment_status,
                    'registered_at': r.registered_at,
                }
                for r in recent_registrations
            ],
        })
