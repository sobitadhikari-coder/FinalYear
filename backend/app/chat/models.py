from django.db import models
from django.conf import settings


class GroupChatMessage(models.Model):

    group = models.ForeignKey(
        "teach_group.TeachGroup",
        on_delete=models.CASCADE,
        related_name="chat_messages"
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="group_chat_messages"
    )

    message = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.username} - {self.group.name}"