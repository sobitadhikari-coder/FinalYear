from rest_framework import serializers
from .models import Class, Subject, TeacherProfile, Availability,Tution


class AvailabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Availability
        fields = '__all__'

class TeacherProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username',read_only=True)
    email = serializers.EmailField(source='user.email',read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    subjects = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        many=True
    )

    class Meta:
        model = TeacherProfile

        fields = [
            'role',
            'username', 
            'email',
            'id',
            'bio',
            'subjects',
            'experience',
            'profile_picture',
            'cv',
            'is_verified',
            ]

class TutionSerializer(serializers.ModelSerializer):

    class_name = serializers.CharField()
    subject = serializers.CharField()

    class Meta:
        model = Tution
        fields = [
            'id',
            'teacher',
            'subject',
            'class_name',
            'price_per_month',
            'hours',
        ]
        read_only_fields = ['teacher']

    def create(self, validated_data):

        class_name = validated_data.pop('class_name')
        subject_name = validated_data.pop('subject')

        class_obj, _ = Class.objects.get_or_create(
            name=class_name.strip()
        )

        subject_obj, _ = Subject.objects.get_or_create( #get if it already exists otherwise create new
            name=subject_name.strip()
        )

        return Tution.objects.create(
            class_name=class_obj,
            subject=subject_obj,
            **validated_data
        )

    def to_representation(self, instance): #converts model intance into json format
        return {
            "id": instance.id,
            "teacher": instance.teacher.user.username,
            "subject": instance.subject.name,
            "class_name": instance.class_name.name,
            "price_per_month": instance.price_per_month,
            "hours": instance.hours,
        }
