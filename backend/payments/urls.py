from django.urls import path
from .views import (
    PaymentDetailView,
    PaymentListCreateView,
    CreateOrderView,
    VerifyPaymentView,
)

urlpatterns = [
    path('', PaymentListCreateView.as_view(), name='payments'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),

    # Razorpay
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify/', VerifyPaymentView.as_view(), name='verify-payment'),
]