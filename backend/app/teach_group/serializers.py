from rest_framework import serializers
from .models import TeachGroup, GroupMember


class GroupMemberSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="student.user.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="student.user.email",
        read_only=True
    )

    class Meta:
        model = GroupMember
        fields = [
            "id",
            "student",
            "username",
            "email",
            "added_at",
        ]


class TeachGroupSerializer(serializers.ModelSerializer):

    tuition_id = serializers.IntegerField(
        source="tuition.id",
        read_only=True
    )

    teacher = serializers.CharField(
        source="tuition.teacher.user.username",
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

    members_count = serializers.SerializerMethodField()

    members = GroupMemberSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = TeachGroup
        fields = [
            "id",
            "name",
            "description",
            "tuition_id",
            "teacher",
            "subject",
            "class_name",
            "video_room_name",
            "members_count",
            "members",
            "created_at",
        ]

    def get_members_count(self, obj):
        return obj.members.count()
    

from rest_framework import serializers
from django.utils import timezone

from .models import GroupMeeting


class GroupMeetingSerializer(serializers.ModelSerializer):

    is_live = serializers.BooleanField(read_only=True)

    class Meta:
        model = GroupMeeting
        fields = [
            "id",
            "group",
            "title",
            "start_time",
            "end_time",
            "meeting_room_name",
            "status",
            "is_live",
            "created_at",
        ]

        read_only_fields = [
            "meeting_room_name",
            "status",
            "created_at",
        ]

    def validate(self, attrs):

        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError(
                "End time must be after start time."
            )

        if start_time and start_time < timezone.now():
            raise serializers.ValidationError(
                "Meeting start time cannot be in the past."
            )

        return attrs