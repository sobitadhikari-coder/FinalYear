import secrets
from datetime import timedelta
from django.utils import timezone
from app.authenticate.models import PasswordResetOtp
from django.db import transaction

def generate_otp():#cryptographically secured
    return str(secrets.randbelow(900000) + 100000)

@transaction.atomic
def create_password_reset_otp(user):
    # Remove previous unused OTPs
    PasswordResetOtp.objects.filter(user=user, is_used=False).delete()

    otp = generate_otp()

    return PasswordResetOtp.objects.create(
        user=user,
        otp=otp,
        expires_at=timezone.now() + timedelta(minutes=5)#5 minutes expiration time if not used
    )
