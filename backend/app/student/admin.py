from django.contrib import admin
from .models import StudentProfile , StudentTution
# Register your models here.
@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        "user",
        "grade",
        "profile_picture",
        "interested_subjects"
    ]

@admin.register(StudentTution)
class StudentTutionAdmin(admin.ModelAdmin):
    list_display = [
        "student",
        "tution",
        "get_hours",
        "enrolled_at"
    ]
    def get_hours(self, obj):
        return obj.tution.hours

    get_hours.short_description = "Hours"
