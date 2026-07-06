import uuid
from rest_framework.generics import (
    RetrieveUpdateAPIView,ListAPIView,CreateAPIView
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from app.teach_group.models import TeachGroup
from rest_framework import status
from rest_framework.parsers import  JSONParser
from .models import TeacherProfile, Tuition ,TuitionApplication
from .serializers import TeacherProfileSerializer, TuitionSerializer,TuitionUpdateSerializer,TutionApplicationCRUDSerializer
from app.authenticate.permissions import IsTeacher,IsTeacher_Verified
from rest_framework.permissions import IsAuthenticated
from .services.application_service import ApplicationService



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

class TutionUpdateViewSet(ModelViewSet):
    serializer_class = TuitionUpdateSerializer
    permission_classes = [
        IsAuthenticated,
        IsTeacher,
        IsTeacher_Verified
    ]
    parser_classes = [JSONParser]

    http_method_names = [
        "get",
        "put",
        "patch",
        "delete",
        "head",
        "options"
    ]

    def get_queryset(self):
        return Tuition.objects.filter(
            teacher__user=self.request.user
        ).order_by("-id")

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        if not serializer.is_valid():
            return Response(
                {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Tuition update failed.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Tuition updated successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Tuition deleted successfully."
            },
            status=status.HTTP_200_OK
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Tuition list fetched successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Tuition details fetched successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

class TutionApplicationUpdateViewSet(ModelViewSet):
    serializer_class = TutionApplicationCRUDSerializer
    permission_classes = [
        IsAuthenticated,
        IsTeacher,
        IsTeacher_Verified,
    ]
    parser_classes = [JSONParser]

    http_method_names = [
        "get",
        "post",
        "head",
        "options",
    ]

    def get_queryset(self):
        return (
            TuitionApplication.objects
            .filter(
                tuition__teacher=self.request.user.teacher_profile
            )
            .select_related(
                "student",
                "student__user",
                "tuition",
                "tuition__subject",
                "tuition__class_name",
            )
            .order_by("-id")
        )

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        application = self.get_object()

        ApplicationService.accept(application)

        serializer = self.get_serializer(application)

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Application accepted successfully.",
                "data": serializer.data,
            }
        )

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        application = self.get_object()

        ApplicationService.reject(application)

        serializer = self.get_serializer(application)

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Application rejected successfully.",
                "data": serializer.data,
            }
        )

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        application = self.get_object()

        ApplicationService.complete(application)

        serializer = self.get_serializer(application)

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Application completed successfully.",
                "data": serializer.data,
            }
        )

    def retrieve(self, request, *args, **kwargs):
        application = self.get_object()

        serializer = self.get_serializer(application)

        return Response(
            {
                "status": status.HTTP_200_OK,
                "message": "Tuition application details fetched successfully.",
                "data": serializer.data,
            }
        )