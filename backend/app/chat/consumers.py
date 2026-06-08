from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync

from app.teach_group.models import TeachGroup
from .models import GroupChatMessage
from .permissions import can_access_group_chat


class GroupChatConsumer(JsonWebsocketConsumer):

    def connect(self):

        self.group_id = self.scope["url_route"]["kwargs"]["group_id"]

        self.user = self.scope["user"]

        print("WebSocket User:", self.user)

        if not self.user.is_authenticated:
            self.close()
            return

        if not can_access_group_chat(self.user, self.group_id):
            self.close()
            return

        self.room_group_name = f"group_chat_{self.group_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def receive_json(self, content, **kwargs):

        message = content.get("message")

        if not message:
            return

        group = TeachGroup.objects.get(id=self.group_id)

        chat_message = GroupChatMessage.objects.create(
            group=group,
            sender=self.user,
            message=message
        )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": chat_message.message,
                "sender": self.user.username,
                "sender_id": self.user.id,
                "created_at": str(chat_message.created_at),
            }
        )

    def chat_message(self, event):

        self.send_json({
            "message": event["message"],
            "sender": event["sender"],
            "sender_id": event["sender_id"],
            "created_at": event["created_at"],
        })



    def disconnect(self, close_code):

        if hasattr(self, "room_group_name"):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )