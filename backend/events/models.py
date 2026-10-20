from django.db import models
from django.conf import settings




class Event(models.Model):

    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]



    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organized_events",
        limit_choices_to={"role": "organizer"},
        null=True,      # Temporary while migrating existing data
        blank=True,
    )


    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    distance = models.CharField(max_length=50)
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    max_participants = models.PositiveIntegerField()
    image_url = models.TextField(blank=True, null=True)
    route_coordinates = models.JSONField(
        default=list,
        blank=True,
        help_text='List of [lat, lng] coordinates for the race route',
    )
    start_latitude = models.FloatField(blank=True, null=True)
    start_longitude = models.FloatField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='upcoming',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def registered_count(self):
        return self.registration_set.count()

    @property
    def is_past(self):
        from django.utils import timezone
        return self.date < timezone.localdate()


