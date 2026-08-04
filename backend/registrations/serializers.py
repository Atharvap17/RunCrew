from rest_framework import serializers
from .models import Registration


class RegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateField(source='event.date', read_only=True)
    event_fees = serializers.DecimalField(
        source='event.fees',
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Registration
        fields = '__all__'
        read_only_fields = ['user', 'bib_number', 'registered_at']
