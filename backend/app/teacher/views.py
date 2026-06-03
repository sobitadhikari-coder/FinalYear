from rest_framework.generics import (
    RetrieveUpdateAPIView,ListAPIView,CreateAPIView
)
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

from .models import TeacherProfile, Tution
from .serializers import TeacherProfileSerializer, TutionSerializer
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

class CreateTutionView(CreateAPIView):

    serializer_class = TutionSerializer
    permission_classes = [IsAuthenticated, IsTeacher, IsTeacher_Verified]

    def perform_create(self, serializer):
        teacher_profile = TeacherProfile.objects.get(
            user=self.request.user
        )

        serializer.save(
            teacher=teacher_profile
        )


class MyTuitionListView(ListAPIView):
    serializer_class = TutionSerializer
    permission_classes = [
        IsAuthenticated,
        IsTeacher,
        IsTeacher_Verified
    ]

    def get_queryset(self):
        return Tution.objects.filter(
            teacher__user=self.request.user
        )
