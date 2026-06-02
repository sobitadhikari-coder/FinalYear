from django import forms
from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.utils.html import format_html

from app.student.models import StudentTution
from .models import TeacherProfile, Availability, Subject,Class,Tution,TuitionApplication

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


@admin.register(TuitionApplication)
class TuitionApplicationAdmin(admin.ModelAdmin):

    list_display = [
        "student",
        "tution",
        "message",
        "status",
        "applied_at",
        # "action_buttons",
    ]
    def accept_application(self, request, pk):
        application = TuitionApplication.objects.get(pk=pk)

        application.status = TuitionApplication.textChoices.ACCEPTED
        application.save()

        StudentTution.objects.get_or_create(
            student=application.student,
            tution=application.tution
        )

        return redirect(request.META.get("HTTP_REFERER", "../"))

    # def get_urls(self):
    #     urls = super().get_urls()

    #     custom_urls = [
    #         path(
    #             "accept/<int:pk>/",
    #             self.admin_site.admin_view(self.accept_application),
    #             name="tuition_application_accept",
    #         ),
    #         path(
    #             "reject/<int:pk>/",
    #             self.admin_site.admin_view(self.reject_application),
    #             name="tuition_application_reject",
    #         ),
    #     ]

    #     return custom_urls + urls

    # def accept_application(self, request, pk):
    #     application = TuitionApplication.objects.get(pk=pk)
    #     application.status = TuitionApplication.textChoices.ACCEPTED
    #     application.save()

    #     return redirect(request.META.get("HTTP_REFERER", "../"))

    # def reject_application(self, request, pk):
    #     application = TuitionApplication.objects.get(pk=pk)
    #     application.status = TuitionApplication.textChoices.REJECTED
    #     application.save()

    #     return redirect(request.META.get("HTTP_REFERER", "../"))

    # def action_buttons(self, obj):
    #     if obj.status == TuitionApplication.textChoices.PENDING:
    #         return format_html(
    #             '<a class="button" href="accept/{}/"> Accept</a>&nbsp;'
    #             '<a class="button" href="reject/{}/"> Reject</a>',
    #             obj.id,
    #             obj.id
    #         )

    #     return obj.status

    # action_buttons.short_description = "Actions"