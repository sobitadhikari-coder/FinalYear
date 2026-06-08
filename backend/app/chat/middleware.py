from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError


User = get_user_model()


@database_sync_to_async
def get_user_from_token(token):
    try:
        access_token = AccessToken(token)

        user_id = access_token.get("user_id")

        if not user_id:
            return AnonymousUser()

        return User.objects.get(id=user_id)

    except (TokenError, User.DoesNotExist, Exception):
        return AnonymousUser()


class JWTAuthMiddleware:

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):

        query_string = scope.get("query_string", b"").decode()

        query_params = parse_qs(query_string)

        token = query_params.get("token")
        print("WS QUERY:", query_string)
        print("WS TOKEN EXISTS:", bool(token))


        if token:
            scope["user"] = await get_user_from_token(token[0])

        else:
            scope["user"] = AnonymousUser()

        return await self.app(scope, receive, send)