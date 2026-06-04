from django import forms
from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.utils.html import format_html
from django.db import transaction

from app.student.models import StudentTuition
from .models import TeacherProfile, Availability, Subject,Class,Tuition,TuitionApplication
from app.teach_group.models import TeachGroup, GroupMember

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

@admin.register(Tuition)
class TutionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "teacher",
        "subject",
        "class_name",
        "price_per_month",
        "hours"
    ]


@admin.register(TuitionApplication)
class TuitionApplicationAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "student",
        "tuition",
        "message",
        "status",
        "applied_at",
        "action_buttons",
    ]

    readonly_fields = [
        "student",
        "tuition",
        "message",
        "applied_at",
    ]

    def get_urls(self):
        urls = super().get_urls()

        custom_urls = [
            path(
                "accept/<int:pk>/",
                self.admin_site.admin_view(self.accept_application),
                name="tuition_application_accept",
            ),
            path(
                "reject/<int:pk>/",
                self.admin_site.admin_view(self.reject_application),
                name="tuition_application_reject",
            ),
        ]

        return custom_urls + urls

    @transaction.atomic
    def accept_application(self, request, pk):

        application = TuitionApplication.objects.get(pk=pk)

        application.status = TuitionApplication.textChoices.ACCEPTED
        application.save()

        # 1. Create enrollment
        StudentTuition.objects.get_or_create(
            student=application.student,
            tuition=application.tuition
        )

        # 2. Get or create default group
        group, _ = TeachGroup.objects.get_or_create(
            tuition=application.tuition,
            defaults={
                "name": f"{application.tuition.class_name.name} {application.tuition.subject.name} Group",
                "description": f"Default group for {application.tuition.subject.name}",
                "video_room_name": f"tuition-{application.tuition.id}-room",
            }
        )

        # 3. Add student to group
        GroupMember.objects.get_or_create(
            group=group,
            student=application.student
        )

        return redirect(request.META.get("HTTP_REFERER", "../"))

    def reject_application(self, request, pk):

        application = TuitionApplication.objects.get(pk=pk)

        application.status = TuitionApplication.textChoices.REJECTED
        application.save()

        return redirect(request.META.get("HTTP_REFERER", "../"))

    def action_buttons(self, obj):

        if obj.status == TuitionApplication.textChoices.PENDING:
            return format_html(
                '<a class="button" href="accept/{}/">Accept</a>&nbsp;'
                '<a class="button" href="reject/{}/"> Reject</a>',
                obj.id,
                obj.id
            )

        return obj.status

    action_buttons.short_description = "Actions"
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