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

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.finish_time:
            total_seconds = int(instance.finish_time.total_seconds())
            hours, remainder = divmod(total_seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            ret['finish_time'] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        return ret
