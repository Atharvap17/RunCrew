from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    registered_count = serializers.SerializerMethodField()
    is_past = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "location",
            "date",
            "time",
            "distance",
            "fees",
            "max_participants",
            "image_url",
            "route_coordinates",
            "start_latitude",
            "start_longitude",
            "is_featured",
            "status",
            "organizer",
            "registered_count",
            "is_past",
        ]
        read_only_fields = ["organizer", "registered_count", "is_past"]

    def get_registered_count(self, obj):
        return obj.registration_set.count()

    def get_is_past(self, obj):
        from django.utils import timezone
        return obj.date < timezone.localdate()
