from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(
        source='registration.event.title',
        read_only=True,
    )
    user_email = serializers.CharField(
        source='registration.user.email',
        read_only=True,
    )
    user_name = serializers.CharField(
        source='registration.user.username',
        read_only=True,
    )
    bib_number = serializers.CharField(
        source='registration.bib_number',
        read_only=True,
    )

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['payment_id', 'transaction_ref', 'status', 'created_at',"razorpay_order_id",
        "razorpay_payment_id","razorpay_signature","paid_at"]
