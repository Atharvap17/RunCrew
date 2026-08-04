from django.urls import path
from .views import (
    CancelRegistrationView,
    RegistrationDetailView,
    RegistrationListCreateView,
)

urlpatterns = [
    path('', RegistrationListCreateView.as_view(), name='registrations'),
    path('<int:pk>/', RegistrationDetailView.as_view(), name='registration-detail'),
    path('<int:pk>/cancel/', CancelRegistrationView.as_view(), name='registration-cancel'),
]
