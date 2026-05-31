from django import forms
from django.contrib import admin
from .models import TeacherProfile, Availability, Subject,Class,Tution

admin.site.register(Class)
admin.site.register(Availability)
admin.site.register(Subject)
@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        "user",
        "profile_picture",
        "get_subjects",
        "experience",
        "is_verified",
    ]

    def get_subjects(self, obj):
        return ", ".join(
            [subject.name for subject in obj.subjects.all()]
        )
    get_subjects.short_description = "Subjects"
    # def get_class_names(self,obj):
    #     return ", ".join([class_name.name for class_name in obj.class_name.all()])
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            # New teacher profile being created
            obj.user.role = "teacher"
            obj.user.is_staff = True
            obj.user.save()
        super().save_model(request, obj, form, change)

@admin.register(Tution)
class TutionAdmin(admin.ModelAdmin):
    list_display = [
        "teacher",
        "subject",
        "class_name",
        "price_per_month",
        "hours"
    ]
