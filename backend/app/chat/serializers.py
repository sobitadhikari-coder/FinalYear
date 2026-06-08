from rest_framework import serializers
from .models import GroupChatMessage


class GroupChatMessageSerializer(serializers.ModelSerializer):

    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True
    )

    sender_role = serializers.CharField(
        source="sender.role",
        read_only=True
    )

    class Meta:
        model = GroupChatMessage
        fields = [
            "id",
            "group",
            "sender",
            "sender_username",
            "sender_role",
            "message",
            "created_at",
        ]

        read_only_fields = [
            "group",
            "sender",
            "created_at",
        ]