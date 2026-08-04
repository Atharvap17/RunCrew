from datetime import time, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from events.models import Event
from registrations.models import Registration
from payments.models import Payment
from results.models import RaceResult
from users.models import User


class Command(BaseCommand):
    help = 'Seed the database with sample marathon data'

    def handle(self, *args, **options):
        admin, created = User.objects.get_or_create(
            email='admin@runcrew.com',
            defaults={
                'username': 'admin',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        participant, created = User.objects.get_or_create(
            email='runner@runcrew.com',
            defaults={
                'username': 'runner',
                'role': 'participant',
                'phone': '9876543210',
                'age': 28,
                'gender': 'male',
            },
        )
        if created:
            participant.set_password('runner123')
            participant.save()
            self.stdout.write(self.style.SUCCESS('Created participant user'))

        events_data = [
            {
                'title': 'Mumbai Marathon 2026',
                'description': 'Experience the iconic coastal route through South Mumbai. '
                'Join 50,000 runners in India\'s largest marathon.',
                'location': 'Marine Drive, Mumbai',
                'date': (timezone.now() + timedelta(days=45)).date(),
                'time': time(6, 0),
                'distance': '42.2 KM',
                'fees': 2500,
                'max_participants': 5000,
                'image_url': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900',
                'start_latitude': 18.9432,
                'start_longitude': 72.8236,
                'route_coordinates': [
                    [18.9432, 72.8236], [18.9388, 72.8291], [18.9320, 72.8345],
                    [18.9250, 72.8400], [18.9180, 72.8450], [18.9100, 72.8500],
                    [18.9050, 72.8550], [18.9000, 72.8600],
                ],
                'is_featured': True,
                'status': 'upcoming',
            },
            {
                'title': 'Delhi Half Marathon',
                'description': 'Run past historic monuments and wide boulevards '
                'in the heart of the capital city.',
                'location': 'India Gate, New Delhi',
                'date': (timezone.now() + timedelta(days=30)).date(),
                'time': time(5, 30),
                'distance': '21.1 KM',
                'fees': 1500,
                'max_participants': 3000,
                'image_url': 'https://images.unsplash.com/photo-1571008887538-b36bb08f4571?w=900',
                'start_latitude': 28.6129,
                'start_longitude': 77.2295,
                'route_coordinates': [
                    [28.6129, 77.2295], [28.6100, 77.2350], [28.6050, 77.2400],
                    [28.6000, 77.2450], [28.5950, 77.2500], [28.5900, 77.2550],
                ],
                'is_featured': True,
                'status': 'upcoming',
            },
            {
                'title': 'Bangalore 10K Run',
                'description': 'A fast, flat course through the garden city. '
                'Perfect for beginners and seasoned runners alike.',
                'location': 'Cubbon Park, Bangalore',
                'date': (timezone.now() + timedelta(days=20)).date(),
                'time': time(6, 30),
                'distance': '10 KM',
                'fees': 800,
                'max_participants': 2000,
                'image_url': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900',
                'start_latitude': 12.9763,
                'start_longitude': 77.5929,
                'route_coordinates': [
                    [12.9763, 77.5929], [12.9780, 77.5950], [12.9800, 77.5980],
                    [12.9820, 77.6010], [12.9840, 77.6040],
                ],
                'is_featured': True,
                'status': 'upcoming',
            },
            {
                'title': 'Pune Trail Run',
                'description': 'Challenge yourself on scenic hill trails '
                'with breathtaking Western Ghats views.',
                'location': 'Sinhagad Fort, Pune',
                'date': (timezone.now() + timedelta(days=60)).date(),
                'time': time(7, 0),
                'distance': '15 KM',
                'fees': 1200,
                'max_participants': 1000,
                'image_url': 'https://images.unsplash.com/photo-1452626212853-3d6db6dd2442?w=900',
                'start_latitude': 18.3665,
                'start_longitude': 73.7557,
                'route_coordinates': [
                    [18.3665, 73.7557], [18.3650, 73.7570], [18.3630, 73.7590],
                    [18.3610, 73.7610],
                ],
                'is_featured': False,
                'status': 'upcoming',
            },
        ]

        for data in events_data:
            Event.objects.get_or_create(title=data['title'], defaults=data)

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write('Admin: admin@runcrew.com / admin123')
        self.stdout.write('Runner: runner@runcrew.com / runner123')
