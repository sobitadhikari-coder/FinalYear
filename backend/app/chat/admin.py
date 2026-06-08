from django.contrib import admin

# Register your models here.
from .models import GroupChatMessage

@admin.register(GroupChatMessage)

class GroupChatMessageAdmin(admin.ModelAdmin):

    list_display = ("id", "group", "sender", "message", "created_at")
    list_filter = ("group", "sender")
    search_fields = ("message", "sender__username", "group__name")