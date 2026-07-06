from rest_framework import serializers
from .models import Class, Subject, TeacherProfile, Availability, Tuition,Tuition ,TuitionApplication


class AvailabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Availability
        fields = '__all__'

class TeacherProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)

    subjects = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )

    subject_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TeacherProfile
        fields = [
            'id',
            'role',
            'username',
            'email',
            'bio',
            'subjects',
            'subject_details',
            'experience',
            'profile_picture',
            'cv',
            'is_verified',
        ]

    def get_subject_details(self, obj):
        return [
            {"id": s.id, "name": s.name}
            for s in obj.subjects.all()
        ]

    def _handle_subjects(self, teacher, subjects_data):
        subject_objs = []

        for name in subjects_data:
            name = name.strip().lower()

            subject, _ = Subject.objects.get_or_create(
                name__iexact=name,
                defaults={"name": name}
            )

            subject_objs.append(subject)

        teacher.subjects.set(subject_objs)

    def create(self, validated_data):
        subjects_data = validated_data.pop("subjects", [])

        teacher = TeacherProfile.objects.create(**validated_data)

        self._handle_subjects(teacher, subjects_data)

        return teacher

    def update(self, instance, validated_data):
        subjects_data = validated_data.pop("subjects", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if subjects_data is not None:
            self._handle_subjects(instance, subjects_data)

        return instance
    




# class TeacherProfileSerializer(serializers.ModelSerializer):
#     username = serializers.CharField(source='user.username',read_only=True)
#     email = serializers.EmailField(source='user.email',read_only=True)
#     role = serializers.CharField(source='user.role', read_only=True)
#     subjects = serializers.PrimaryKeyRelatedField(
#         queryset=Subject.objects.all(),
#         many=True
#     )

#     class Meta:
#         model = TeacherProfile

#         fields = [
#             'role',
#             'username', 
#             'email',
#             'id',
#             'bio',
#             'subjects',
#             'experience',
#             'profile_picture',
#             'cv',
#             'is_verified',
#             ]

class TuitionSerializer(serializers.ModelSerializer):

    class_name = serializers.CharField()
    subject = serializers.CharField()

    class Meta:
        model = Tuition
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

        subject_obj, _ = Subject.objects.get_or_create(
            name=subject_name.strip()
        )

        return Tuition.objects.create(
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

class TuitionUpdateSerializer(serializers.ModelSerializer):

    class_name = serializers.SlugRelatedField(
        queryset=Class.objects.all(),
        slug_field='name'
    )
    subject = serializers.SlugRelatedField(
        queryset=Subject.objects.all(),
        slug_field='name'
    )

    class Meta:
        model = Tuition
        fields = [
            'id',
            'teacher',
            'subject',
            'class_name',
            'price_per_month',
            'hours',
        ]
        read_only_fields = ['id','teacher',]

class TutionApplicationCRUDSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.user.username",
        read_only=True
    )

    subject = serializers.CharField(
        source="tuition.subject.name",
        read_only=True
    )

    class_name = serializers.CharField(
        source="tuition.class_name.name",
        read_only=True
    )

    price_per_month = serializers.IntegerField(
        source="tuition.price_per_month",
        read_only=True
    )

    hours = serializers.IntegerField(
        source="tuition.hours",
        read_only=True
    )

    class Meta:
        model = TuitionApplication
        fields = [
            "id",
            "student",
            "student_name",
            "tuition",
            "subject",
            "class_name",
            "price_per_month",
            "hours",
            "message",
            "status",
            "applied_at",
        ]
        read_only_fields = [
            "id",
            "student",
            "student_name",
            "tuition",
            "subject",
            "class_name",
            "price_per_month",
            "hours",
            "message",
            "applied_at",
        ]