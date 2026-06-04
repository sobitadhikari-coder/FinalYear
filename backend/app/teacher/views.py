import uuid

from rest_framework.generics import (
    RetrieveUpdateAPIView,ListAPIView,CreateAPIView
)
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

from app.teach_group.models import TeachGroup

from .models import TeacherProfile, Tuition
from .serializers import TeacherProfileSerializer, TuitionSerializer
from app.authenticate.permissions import IsTeacher,IsTeacher_Verified


class TeacherProfileView(
    RetrieveUpdateAPIView
):

    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated, IsTeacher]


    def get_object(self):

        return TeacherProfile.objects.get(
            user=self.request.user
        )


class TeacherListView(ListAPIView):
    permission_classes = [IsAuthenticated]

    serializer_class = TeacherProfileSerializer

    queryset = TeacherProfile.objects.filter(
        is_verified=True
    )

class CreateTuitionView(CreateAPIView):

    serializer_class = TuitionSerializer
    permission_classes = [IsAuthenticated, IsTeacher, IsTeacher_Verified]

    def perform_create(self, serializer):
        teacher_profile = TeacherProfile.objects.get(
            user=self.request.user
        )

    
        tuition = serializer.save(
            teacher=teacher_profile
        )

        TeachGroup.objects.create(
            tuition=tuition,
            name = f"{tuition.class_name.name} {tuition.subject.name} Group #{tuition.id}",
            description=f"Default group for {tuition.subject.name}",
            video_room_name=f"room-{uuid.uuid4().hex}" 

        )


class MyTuitionListView(ListAPIView):
    serializer_class = TuitionSerializer
    permission_classes = [
        IsAuthenticated,
        IsTeacher,
        IsTeacher_Verified
    ]

    def get_queryset(self):
        return Tuition.objects.filter(
            teacher__user=self.request.user
        )
