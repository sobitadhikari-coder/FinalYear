from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
import re

from app.teacher.models import TeacherProfile
from app.student.models import StudentProfile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    role = serializers.ChoiceField(
        choices=[
            ('student', 'Student'),
            ('teacher', 'Teacher'),
            ('admin', 'Admin'),
        ],
        default='student'
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'phone_number',
            'password',
            'role'
        ]

    def validate_phone_number(self, value):

        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError(
                "Phone number must be exactly 10 digits."
            )

        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "Phone number already exists."
            )

        return value

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def validate_password(self, value):

        try:
            validate_password(value)

        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError(
                "Password must contain a special character."
            )

        return value

    def create(self, validated_data):

        role = validated_data.pop('role')

        user = User.objects.create_user(
            role=role,
            **validated_data
        )

        # create role-specific profile
        if role == 'teacher':
            TeacherProfile.objects.create(user=user)

        elif role == 'student':
            StudentProfile.objects.create(user=user)

        return user

class LoginSerializer(serializers.Serializer):

    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):

        identifier = data.get("identifier")
        password = data.get("password")

        user = None

        # email login
        if "@" in identifier:
            user = User.objects.filter(
                email__iexact=identifier
            ).first()

        # phone login
        elif identifier.isdigit():
            user = User.objects.filter(
                phone_number=identifier
            ).first()

        if not user:
            raise serializers.ValidationError(
                "User not found"
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid credentials"
            )

        data['user'] = user

        return data