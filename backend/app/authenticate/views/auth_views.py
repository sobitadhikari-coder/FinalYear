# accounts/views.py

from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers.auth_serializers import (
    RegisterSerializer,
    LoginSerializer,
)

from ..services.auth_services import (
    create_password_reset_otp,
    verify_password_reset_otp,
    reset_user_password,
)

User = get_user_model()


# ==========================================
# REGISTER
# ==========================================

class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "User registered successfully.",

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "role": user.role,
                }

                # "tokens": {
                #     "refresh": str(refresh),
                #     "access": str(refresh.access_token),
                # }
            },

            status=status.HTTP_201_CREATED
        )


# ==========================================
# LOGIN
# ==========================================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "role": user.role,
                },

                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            },

            status=status.HTTP_200_OK
        )


# # ==========================================
# # REQUEST PASSWORD RESET OTP
# # ==========================================

# class RequestPasswordResetOtpView(APIView):

#     permission_classes = [AllowAny]

#     def post(self, request):

#         identifier = request.data.get(
#             "identifier"
#         )

#         if not identifier:
#             return Response(
#                 {
#                     "error": "Identifier is required."
#                 },

#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user = None

#         if "@" in identifier:

#             user = User.objects.filter(
#                 email__iexact=identifier
#             ).first()

#         elif identifier.isdigit():

#             user = User.objects.filter(
#                 phone_number=identifier
#             ).first()

#         else:

#             user = User.objects.filter(
#                 username__iexact=identifier
#             ).first()

#         if not user:
#             return Response(
#                 {
#                     "error": "User not found."
#                 },

#                 status=status.HTTP_404_NOT_FOUND
#             )

#         otp = create_password_reset_otp(
#             user
#         )


#         return Response(
#             {
#                 "message": "OTP generated successfully.",
#                 "otp": otp        # send otp here using email/sms

#             },

#             status=status.HTTP_200_OK
#         )


# # ==========================================
# # VERIFY OTP
# # ==========================================

# class VerifyOtpView(APIView):

#     permission_classes = [AllowAny]

#     def post(self, request):

#         identifier = request.data.get(
#             "identifier"
#         )

#         otp = request.data.get("otp")

#         if not identifier or not otp:

#             return Response(
#                 {
#                     "error": "Identifier and OTP required."
#                 },

#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user = None

#         if "@" in identifier:

#             user = User.objects.filter(
#                 email__iexact=identifier
#             ).first()

#         elif identifier.isdigit():

#             user = User.objects.filter(
#                 phone_number=identifier
#             ).first()

#         else:

#             user = User.objects.filter(
#                 username__iexact=identifier
#             ).first()

#         if not user:

#             return Response(
#                 {
#                     "error": "User not found."
#                 },

#                 status=status.HTTP_404_NOT_FOUND
#             )

#         verify_password_reset_otp(
#             user=user,
#             otp=otp
#         )

#         return Response(
#             {
#                 "message": "OTP verified successfully."
#             },

#             status=status.HTTP_200_OK
#         )


# # ==========================================
# # RESET PASSWORD
# # ==========================================

# class ResetPasswordView(APIView):

#     permission_classes = [AllowAny]

#     def post(self, request):

#         identifier = request.data.get(
#             "identifier"
#         )

#         new_password = request.data.get(
#             "new_password"
#         )

#         if not identifier or not new_password:

#             return Response(
#                 {
#                     "error": "Identifier and new password required."
#                 },

#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user = None

#         if "@" in identifier:

#             user = User.objects.filter(
#                 email__iexact=identifier
#             ).first()

#         elif identifier.isdigit():

#             user = User.objects.filter(
#                 phone_number=identifier
#             ).first()

#         else:

#             user = User.objects.filter(
#                 username__iexact=identifier
#             ).first()

#         if not user:

#             return Response(
#                 {
#                     "error": "User not found."
#                 },

#                 status=status.HTTP_404_NOT_FOUND
#             )

#         reset_user_password(
#             user=user,
#             new_password=new_password
#         )

#         return Response(
#             {
#                 "message": "Password reset successful."
#             },

#             status=status.HTTP_200_OK
#         )