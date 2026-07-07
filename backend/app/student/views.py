from django.shortcuts import render
from app.student.serializers import StudentProfileSerializer, TuitionApplicationSerializer
from .models import StudentProfile
from rest_framework.permissions import IsAuthenticated
from app.authenticate.permissions import IsStudent
from rest_framework.generics import (
    CreateAPIView, RetrieveUpdateAPIView,ListAPIView,RetrieveAPIView
)
from app.teacher.models import Tuition , TuitionApplication
from app.teacher.serializers import TuitionSerializer
# Create your views here.

class StudentProfileView(RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, _ = StudentProfile.objects.get_or_create(
            user=self.request.user
        )
        return obj

class TuitionListView(ListAPIView):
    serializer_class = TuitionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Tuition.objects.filter(
            teacher__is_verified=True
        )

        if hasattr(self.request.user, "student_profile"):
            applied_ids = TuitionApplication.objects.filter(
                student=self.request.user.student_profile
            ).values_list("tuition_id", flat=True)

            queryset = queryset.exclude(id__in=applied_ids)

        return queryset
    
class TuitionDetailView(RetrieveAPIView):
    serializer_class = TuitionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Tuition.objects.filter(
            teacher__is_verified=True
        )

        if hasattr(self.request.user, "student_profile"):
            applied_ids = TuitionApplication.objects.filter(
                student=self.request.user.student_profile
            ).values_list("tuition_id", flat=True)

            queryset = queryset.exclude(id__in=applied_ids)

        return queryset

class ApplyTuitionView(CreateAPIView):
    serializer_class = TuitionApplicationSerializer
    permission_classes = [IsAuthenticated,IsStudent]

    def perform_create(self, serializer):
        student = StudentProfile.objects.get(
            user=self.request.user
        )
        serializer.save(
            student=student
        )

class MyTuitionApplicationsView(ListAPIView):
    serializer_class = TuitionApplicationSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        queryset = (
            TuitionApplication.objects
            .filter(student=self.request.user.student_profile)
            .select_related(
                "tuition",
                "tuition__teacher",
                "tuition__subject",
                "tuition__class_name",
            )
            .order_by("-applied_at")
        )

        status = self.request.query_params.get("status")

        if status:
            queryset = queryset.filter(status=status)

        return queryset























# ListAPIView	GET	List multiple objects
# RetrieveAPIView	GET	Retrieve a single object
# CreateAPIView	POST	Create a new object
# UpdateAPIView	PUT, PATCH	Update an existing object
# DestroyAPIView	DELETE	Delete an object
# ListCreateAPIView	GET, POST	List and create objects
# RetrieveUpdateAPIView	GET, PUT, PATCH	Retrieve and update an object
# RetrieveDestroyAPIView	GET, DELETE	Retrieve and delete an object
# RetrieveUpdateDestroyAPIView	GET, PUT, PATCH, DELETE	Full CRUD except list
# ModelViewSet	GET, POST, PUT, PATCH, DELETE	Complete CRUD operations in a single class