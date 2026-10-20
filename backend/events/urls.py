from django.urls import path

from .views import (
    EventListCreateView,
    EventDetailView,
    EventParticipantsView,
)
from .chatbot_views import EventChatbotView

urlpatterns = [
    path('', EventListCreateView.as_view(), name='events'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path(
        '<int:pk>/participants/',
        EventParticipantsView.as_view(),
        name='event-participants',
    ),
    path(
        'chatbot/',
        EventChatbotView.as_view(),
        name='event-chatbot',
    ),
]
