from rest_framework import serializers

from app.teacher.models import Tution
from app.teacher.serializers import TutionSerializer
from .models import StudentProfile
from app.teacher.models import TuitionApplication

class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    role=serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            'role',
            'username',
            'email',
            'phone_number',
            'id',
            'grade',
            'profile_picture',
            'interested_subjects'
        ]

class TuitionApplicationSerializer(serializers.ModelSerializer):
    tution_details = TutionSerializer(
        source="tution",
        read_only=True
    )
    class Meta:
        model = TuitionApplication
        fields = [
            "id",
            "tution",
            "message",
            "tution_details",
        ]

