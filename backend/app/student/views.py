from django.shortcuts import render
from app.student.serializers import StudentProfileSerializer
from rest_framework import generics 
from .models import StudentProfile
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    CreateAPIView, RetrieveUpdateAPIView,ListAPIView,RetrieveAPIView
)
from app.teacher.models import Tution
from app.teacher.serializers import TutionSerializer
# Create your views here.

class StudentProfileView(RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, _ = StudentProfile.objects.get_or_create(
            user=self.request.user
        )
        return obj



class TutionListView(ListAPIView):
    serializer_class = TutionSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        return Tution.objects.all()
    

class TutionDetailView(RetrieveAPIView):
    serializer_class = TutionSerializer
    permission_classes = [IsAuthenticated]

    queryset = Tution.objects.filter(
        teacher__is_verified=True
    )

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