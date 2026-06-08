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