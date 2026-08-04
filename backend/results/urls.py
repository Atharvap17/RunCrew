from django.urls import path
from .views import RaceResultDetailView, RaceResultListCreateView

urlpatterns = [
    path('', RaceResultListCreateView.as_view(), name='results'),
    path('<int:pk>/', RaceResultDetailView.as_view(), name='result-detail'),
]
