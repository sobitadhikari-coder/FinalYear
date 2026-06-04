from django.contrib import admin
from .models import TeachGroup,GroupMember


class GroupMemberInline(admin.TabularInline):
    model = GroupMember
    extra = 1


@admin.register(TeachGroup)
class TeachGroupAdmin(admin.ModelAdmin):

    list_display = [
        "name",
        "tuition",
        "video_room_name",
        "created_at",
    ]

    search_fields = [
        "name",
        "tuition__subject__name",
        "tuition__class_name__name",
        "tuition__teacher__user__username",
    ]

    inlines = [
        GroupMemberInline
    ]


@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):

    list_display = [
        "group",
        "student",
        "added_at",
    ]

    search_fields = [
        "group__name",
        "student__user__username",
        "student__user__email",
    ]
    