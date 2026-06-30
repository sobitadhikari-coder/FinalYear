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
    
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import TeachGroup, GroupMeeting
from .serializers import GroupMeetingSerializer
from .permissions import get_group_if_user_has_access

class CreateGroupMeetingView(CreateAPIView):

    serializer_class = GroupMeetingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        group = get_group_if_user_has_access(
            self.request.user,
            self.kwargs["group_id"]
        )

        if not group:
            raise PermissionDenied(
                "You do not have access to this group."
            )

        if self.request.user.role != "teacher":
            raise PermissionDenied(
                "Only teacher can schedule meeting."
            )

        if group.tuition.teacher.user != self.request.user:
            raise PermissionDenied(
                "You can only schedule meeting for your own group."
            )

        serializer.save(group=group)

class GroupMeetingListView(ListAPIView):

    serializer_class = GroupMeetingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        group = get_group_if_user_has_access(
            self.request.user,
            self.kwargs["group_id"]
        )

        if not group:
            raise PermissionDenied(
                "You do not have access to this group."
            )

        return GroupMeeting.objects.filter(
            group=group
        ).order_by("start_time")
    
class GroupMeetingVideoRoomView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, meeting_id):

        try:
            meeting = GroupMeeting.objects.select_related(
                "group",
                "group__tuition",
                "group__tuition__teacher",
                "group__tuition__teacher__user"
            ).get(id=meeting_id)

        except GroupMeeting.DoesNotExist:
            raise ValidationError(
                "Meeting not found."
            )

        group = get_group_if_user_has_access(
            request.user,
            meeting.group.id
        )

        if not group:
            raise PermissionDenied(
                "You do not have access to this meeting."
            )

        now = timezone.now()

        if meeting.status == GroupMeeting.MeetingStatus.CANCELLED:
            raise PermissionDenied(
                "This meeting has been cancelled."
            )

        if now < meeting.start_time:
            raise PermissionDenied(
                "Meeting has not started yet."
            )

        if now > meeting.end_time:
            raise PermissionDenied(
                "Meeting has already ended."
            )

        return Response({
            "meeting_id": meeting.id,
            "group_id": meeting.group.id,
            "group_name": meeting.group.name,
            "title": meeting.title,
            "start_time": meeting.start_time,
            "end_time": meeting.end_time,
            "meeting_room_name": meeting.meeting_room_name,
            "jitsi_url": f"https://meet.jit.si/{meeting.meeting_room_name}",
            "is_live": meeting.is_live,
        })
    
