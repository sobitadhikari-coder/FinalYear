from rest_framework.permissions import BasePermission
from app.teacher.models import TeacherProfile

class IsTeacher(BasePermission):

    def has_permission(self, request, view):

        return bool(
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'teacher_profile')
        )

class IsTeacher_Verified(BasePermission):

    def has_permission(self, request, view):

        return bool(
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'teacher_profile') and
            request.user.teacher_profile.is_verified
        )


class IsStudent(BasePermission):

    def has_permission(self, request, view):

        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == "student"
        )