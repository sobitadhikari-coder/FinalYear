from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import transaction
from app.authenticate.services.email_services import send_otp_email
from app.authenticate.services.otp_services import create_password_reset_otp
from app.authenticate.models import PasswordResetOtp
User = get_user_model()


class RequestPasswordResetView(APIView):

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email required"}, status=400)

        user = User.objects.filter(email__iexact=email).first()

        if user:
            otp_obj = create_password_reset_otp(user)
            send_otp_email(user, otp_obj.otp)

        return Response({
            "message": f"If account exists, OTP has been sent to {email}"
        })


class VerifyResetOTPView(APIView):

    def post(self, request):
        email= request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("password")

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            return Response({"error": "Invalid request"}, status=400)

        otp_obj = PasswordResetOtp.objects.filter(
            user=user,
            otp=otp,
            is_used=False
        ).order_by("-created_at").first()

        if not otp_obj:
            return Response({"error": "Invalid OTP"}, status=400)

        if otp_obj.is_expired():
            return Response({"error": "OTP expired"}, status=400)

        with transaction.atomic():
            user.set_password(new_password)
            user.save()

            otp_obj.is_used = True
            otp_obj.save()

        return Response({"message": "Password reset successful"})