from django.urls import path
from .views import (
    MyTeachGroupListView,
    TeachGroupDetailView,
    GroupMessageHistoryView,
    GroupVideoRoomView,
)


urlpatterns = [
    path(
        "my-groups/",
        MyTeachGroupListView.as_view(),
        name="my-groups"
    ),

    path(
        "<int:group_id>/",
        TeachGroupDetailView.as_view(),
        name="group-detail"
    ),

    path(
        "<int:group_id>/messages/",
        GroupMessageHistoryView.as_view(),
        name="group-messages"
    ),

    path(
        "<int:group_id>/video-room/",
        GroupVideoRoomView.as_view(),
        name="group-video-room"
    ),
]




from .views import (
    CreateGroupMeetingView,
    GroupMeetingListView,
    GroupMeetingVideoRoomView,
)


urlpatterns += [
    path(
        "<int:group_id>/meetings/create/",
        CreateGroupMeetingView.as_view(),
        name="create-group-meeting"
    ),

    path(
        "<int:group_id>/meetings/",
        GroupMeetingListView.as_view(),
        name="group-meetings"
    ),

    path(
        "meetings/<int:meeting_id>/video-room/",
        GroupMeetingVideoRoomView.as_view(),
        name="group-meeting-video-room"
    ),
]