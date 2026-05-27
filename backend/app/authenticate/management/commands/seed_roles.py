from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission


class Command(BaseCommand):
    help = "Create default roles and permissions"

    def handle(self, *args, **kwargs):

        roles = ['Admin', 'Teacher', 'Student']

        for role in roles:
            group, created = Group.objects.get_or_create(name=role)

            if created:
                self.stdout.write(self.style.SUCCESS(f"{role} group created"))
            else:
                self.stdout.write(f"{role} already exists")

        self.stdout.write(self.style.SUCCESS("All roles initialized successfully"))