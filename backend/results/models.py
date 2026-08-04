from django.db import models


class RaceResult(models.Model):

    registration = models.OneToOneField(
        'registrations.Registration',
        on_delete=models.CASCADE
    )

    finish_time = models.DurationField()

    rank = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"Result #{self.id}" 