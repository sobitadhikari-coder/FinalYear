# accounts/services.py

import random
from datetime import timedelta

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils import timezone

from rest_framework.exceptions import ValidationError as DRFValidationError

from app.teacher.models import TeacherProfile
from app.student.models import StudentProfile

from ..models import (
    CustomUser,
    PasswordResetOtp
)


# ==========================================
# REGISTER SERVICE
# ==========================================

def register_user(validated_data):

    role = validated_data.pop(
        "role",
        "student"
    )

    password = validated_data.pop("password")

    validate_user_password(password)

    user = CustomUser.objects.create_user(
        password=password,
        role=role,
        **validated_data
    )

    create_role_profile(
        user=user,
        role=role
    )

    return user


# ==========================================
# LOGIN SERVICE
# ==========================================

def authenticate_user(identifier, password):

    user = None

    # login with email
    if "@" in identifier:

        user = CustomUser.objects.filter(
            email__iexact=identifier
        ).first()

    # login with phone number
    elif identifier.isdigit():

        user = CustomUser.objects.filter(
            phone_number=identifier
        ).first()

    # login with username
    else:

        user = CustomUser.objects.filter(
            username__iexact=identifier
        ).first()

    if not user:
        raise DRFValidationError(
            "User not found."
        )

    if not user.check_password(password):
        raise DRFValidationError(
            "Invalid credentials."
        )

    return user



def create_role_profile(user, role):

    if role == "teacher":

        TeacherProfile.objects.get_or_create(
            user=user
        )

    elif role == "student":

        StudentProfile.objects.get_or_create(
            user=user
        )


# ==========================================
# PASSWORD VALIDATION SERVICE
# ==========================================

def validate_user_password(password):

    try:
        validate_password(password)

    except ValidationError as e:
        raise DRFValidationError(
            list(e.messages)
        )


# ==========================================
# OTP GENERATION SERVICE
# ==========================================

def generate_otp():

    return str(
        random.randint(100000, 999999)
    )


# ==========================================
# CREATE PASSWORD RESET OTP
# ==========================================

def create_password_reset_otp(user):

    otp = generate_otp()

    expires_at = timezone.now() + timedelta(
        minutes=5
    )

    PasswordResetOtp.objects.create(
        user=user,
        otp=otp,
        expires_at=expires_at
    )

    return otp


# ==========================================
# VERIFY OTP SERVICE
# ==========================================

def verify_password_reset_otp(user, otp):

    otp_instance = PasswordResetOtp.objects.filter(
        user=user,
        otp=otp,
        is_used=False
    ).first()

    if not otp_instance:
        raise DRFValidationError(
            "Invalid OTP."
        )

    if otp_instance.is_expired():
        raise DRFValidationError(
            "OTP expired."
        )

    otp_instance.is_used = True
    otp_instance.save()

    return True


# ==========================================
# RESET PASSWORD SERVICE
# ==========================================

def reset_user_password(user, new_password):

    validate_user_password(new_password)

    user.set_password(new_password)
    user.save()

    return user