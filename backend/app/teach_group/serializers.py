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