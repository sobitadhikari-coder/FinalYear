from django.contrib import admin
from .models import StudentProfile , StudentTuition 
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

@admin.register(StudentTuition)
class StudentTuitionAdmin(admin.ModelAdmin):
    list_display = [
        "student",
        "tuition",
        "get_hours",
        "enrolled_at"
    ]
    def get_hours(self, obj):
        return obj.tuition.hours

    get_hours.short_description = "Hours"

