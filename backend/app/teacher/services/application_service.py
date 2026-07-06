from django.db import transaction
from rest_framework.exceptions import ValidationError

from ..models import TuitionApplication
from app.student.models import StudentTuition
from app.teach_group.models import TeachGroup, GroupMember


class ApplicationService:

    @staticmethod
    def _validate_status(application, expected_status):
        """
        Ensure the application is in the expected state before
        performing a transition.
        """
        if application.status != expected_status:
            raise ValidationError(
                {
                    "detail": (
                        f"Only {expected_status} applications can perform this action."
                    )
                }
            )

    @staticmethod
    def _get_default_group(tuition):
        """
        Returns the default teaching group for a tuition.
        Creates it if it doesn't already exist.
        """
        group, _ = TeachGroup.objects.get_or_create(
            tuition=tuition,
            is_default=True,
            defaults={
                "name": f"{tuition.class_name.name} {tuition.subject.name} Group",
                "description": (
                    f"Default group for {tuition.subject.name}"
                ),
                "video_room_name": f"tuition-{tuition.id}-room",
            },
        )

        return group

    @staticmethod
    @transaction.atomic
    def accept(application):
        """
        Accept a tuition application.

        Actions:
        - Change status to ACCEPTED
        - Enroll student
        - Create default group (if needed)
        - Add student to the group
        """

        ApplicationService._validate_status(
            application,
            TuitionApplication.textChoices.PENDING,
        )

        application.status = TuitionApplication.textChoices.ACCEPTED
        application.save(update_fields=["status"])

        StudentTuition.objects.get_or_create(
            student=application.student,
            tuition=application.tuition,
        )

        group = ApplicationService._get_default_group(
            application.tuition
        )

        GroupMember.objects.get_or_create(
            group=group,
            student=application.student,
        )

        return application

    @staticmethod
    @transaction.atomic
    def reject(application):
        """
        Reject a pending tuition application.
        """

        ApplicationService._validate_status(
            application,
            TuitionApplication.textChoices.PENDING,
        )

        application.status = TuitionApplication.textChoices.REJECTED
        application.save(update_fields=["status"])

        return application

    @staticmethod
    @transaction.atomic
    def complete(application):
        """
        Mark an accepted tuition application as completed.
        """

        ApplicationService._validate_status(
            application,
            TuitionApplication.textChoices.ACCEPTED,
        )

        application.status = TuitionApplication.textChoices.COMPLETED
        application.save(update_fields=["status"])

        return application