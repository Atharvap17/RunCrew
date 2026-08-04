from rest_framework import serializers
from .models import RaceResult


class RaceResultSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(
        source='registration.event.title',
        read_only=True,
    )
    user_name = serializers.CharField(
        source='registration.user.username',
        read_only=True,
    )
    user_email = serializers.CharField(
        source='registration.user.email',
        read_only=True,
    )
    bib_number = serializers.CharField(
        source='registration.bib_number',
        read_only=True,
    )
    event_id = serializers.IntegerField(
        source='registration.event.id',
        read_only=True,
    )

    class Meta:
        model = RaceResult
        fields = '__all__'
