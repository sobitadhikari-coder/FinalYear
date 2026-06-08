from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import TeachGroup
from .serializers import TeachGroupSerializer
from .permissions import get_group_if_user_has_access

from app.chat.models import GroupChatMessage
from app.chat.serializers import GroupChatMessageSerializer


class MyTeachGroupListView(ListAPIView):

    serializer_class = TeachGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        queryset = TeachGroup.objects.select_related(
            "tuition__teacher__user",
            "tuition__subject",
            "tuition__class_name"
        ).prefetch_related(
            "members__student__user"
        )

        if user.is_superuser or user.role == "admin":
            return queryset

        if user.role == "teacher":
            return queryset.filter(
                tuition__teacher__user=user
            )

        if user.role == "student":
            return queryset.filter(
                members__student__user=user
            ).distinct()

        return TeachGroup.objects.none()


class TeachGroupDetailView(RetrieveAPIView):

    serializer_class = TeachGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):

        group = get_group_if_user_has_access(
            self.request.user,
            self.kwargs["group_id"]
        )

        if not group:
            raise PermissionDenied(
                "You do not have access to this group."
            )

        return group


class GroupMessageHistoryView(ListAPIView):

    serializer_class = GroupChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        group = get_group_if_user_has_access(
            self.request.user,
            self.kwargs["group_id"]
        )

        if not group:
            raise PermissionDenied(
                "You do not have access to this group chat."
            )

        return GroupChatMessage.objects.filter(
            group=group
        ).select_related(
            "sender"
        )


class GroupVideoRoomView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):

        group = get_group_if_user_has_access(
            request.user,
            group_id
        )

        if not group:
            raise PermissionDenied(
                "You do not have access to this video room."
            )

        return Response({
            "group_id": group.id,
            "group_name": group.name,
            "video_room_name": group.video_room_name,
            "jitsi_url": f"https://meet.jit.si/{group.video_room_name}"
        })