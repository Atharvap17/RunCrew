# pyrefly: ignore [missing-import]
import razorpay
from django.utils import timezone

from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from registrations.models import Registration
from users.permissions import IsAdminOrOrganizer
from .models import Payment
from .serializers import PaymentSerializer


client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET,
    )
)

class PaymentListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET' and self.request.user.role in ('admin', 'organizer'):
            return [IsAdminOrOrganizer()]
        return [IsAuthenticated()]

    def get(self, request):
        if request.user.role == 'admin':
            payments = Payment.objects.all().select_related(
                'registration__user',
                'registration__event',
            )
        elif request.user.role == 'organizer':
            payments = Payment.objects.filter(
                registration__event__organizer=request.user,
            ).select_related(
                'registration__user',
                'registration__event',
            )
        else:
            payments = Payment.objects.filter(
                registration__user=request.user,
            ).select_related('registration__event')

        return Response(PaymentSerializer(payments, many=True).data)

    def post(self, request):
        registration_id = request.data.get('registration')
        payment_method = request.data.get('payment_method', 'card')

        try:
            registration = Registration.objects.select_related('event', 'user').get(
                id=registration_id,
                user=request.user,
            )
        except Registration.DoesNotExist:
            return Response({'error': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)

        if registration.payment_status == 'completed':
            return Response({'error': 'Already paid'}, status=status.HTTP_400_BAD_REQUEST)

        if hasattr(registration, 'payment'):
            payment = registration.payment
            payment.payment_method = payment_method
            payment.status = "completed"
            payment.paid_at = timezone.now()
            payment.transaction_ref = f"TXN{timezone.now().strftime('%Y%m%d%H%M%S')}"
            payment.save()
        else:
            payment = Payment.objects.create(
                registration=registration,
                amount=registration.event.fees,
                payment_method=payment_method,
                status="completed",
                paid_at=timezone.now(),
                transaction_ref=f"TXN{timezone.now().strftime('%Y%m%d%H%M%S')}",
            )

        registration.payment_status = "completed"
        registration.status = "confirmed"
        registration.save()

        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED,
        )


class PaymentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            if request.user.role in ('admin', 'organizer'):
                payment = Payment.objects.select_related(
                    'registration__user',
                    'registration__event',
                ).get(pk=pk)
            else:
                payment = Payment.objects.select_related(
                    'registration__event',
                ).get(pk=pk, registration__user=request.user)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(PaymentSerializer(payment).data)


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        registration_id = request.data.get("registration")

        if not registration_id:
            return Response(
                {"error": "Registration ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            registration = Registration.objects.select_related("event").get(
                id=registration_id,
                user=request.user,
            )
        except Registration.DoesNotExist:
            return Response(
                {"error": "Registration not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if registration.payment_status == "completed":
            return Response(
                {"error": "Payment already completed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment, created = Payment.objects.get_or_create(
            registration=registration,
            defaults={
                "amount": registration.event.fees,
                "payment_method": "card",
                "status": "pending",
            },
        )

        payment.amount = registration.event.fees
        payment.payment_method = "card"
        payment.status = "pending"
        payment.save()

        amount = int(float(payment.amount) * 100)
        order_id = f"order_demo_{payment.id}_{int(timezone.now().timestamp())}"

        try:
            razorpay_order = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1,
            })
            order_id = razorpay_order["id"]
        except Exception:
            pass

        payment.razorpay_order_id = order_id
        payment.save()

        return Response(
            {
                "success": True,
                "payment_id": payment.id,
                "order_id": order_id,
                "amount": amount,
                "currency": "INR",
                "key": getattr(settings, "RAZORPAY_KEY_ID", "rzp_test_demo"),
                "event": registration.event.title,
            },
            status=status.HTTP_200_OK,
        )


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("payment_id")
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        if not all([
            payment_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        ]):
            return Response(
                {"error": "Missing payment details"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment = Payment.objects.select_related(
                "registration__user",
                "registration__event",
        ).get(
            id=payment_id,
            registration__user=request.user,
            razorpay_order_id=razorpay_order_id,
        )
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if payment.status == "completed":
            return Response(
                {"error": "Payment already verified"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"error": "Invalid payment signature"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        payment.razorpay_order_id = razorpay_order_id
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.payment_id = razorpay_payment_id
        payment.transaction_ref = razorpay_payment_id
        payment.status = "completed"
        payment.paid_at = timezone.now()
        payment.save()

        registration = payment.registration
        registration.payment_status = "completed"
        registration.status = "confirmed"
        registration.save()

        send_mail(
            subject=f"RunCrew Payment Confirmation - {registration.event.title}",
            message=(
                f"Hi {registration.user.first_name},\n\n"
                f"Your payment of ₹{payment.amount} has been received successfully.\n\n"
                f"Event: {registration.event.title}\n"
                f"Bib Number: {registration.bib_number}\n"
                f"Transaction ID: {payment.transaction_ref}\n\n"
                f"Thank you for registering.\n\n"
                f"RunCrew Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[registration.user.email],
            fail_silently=True,
        )

        return Response(
            {
                "success": True,
                "message": "Payment verified successfully",
                "payment": PaymentSerializer(payment).data,
            },
            status=status.HTTP_200_OK,
        )

