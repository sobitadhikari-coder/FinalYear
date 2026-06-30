# accounts/urls.py

from django.urls import path

from app.authenticate.views.change_password import ChangePasswordView
from app.authenticate.views.pass_views import RequestPasswordResetView, VerifyResetOTPView
from app.authenticate.views.profile_views import ProfileImageUploadView, ProfileView
from rest_framework_simplejwt.views import TokenRefreshView

from .views.auth_views import (
    RegisterView,
    LoginView,
    # RequestPasswordResetOtpView,
    # VerifyOtpView,
    # ResetPasswordView,
)

urlpatterns = [

    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'login/',
        LoginView.as_view(),
        name='login'
    ),
    path('profile/', ProfileView.as_view(), name='profile'),
    path("forgot_password/", RequestPasswordResetView.as_view()),
    path("verify_otp/", VerifyResetOTPView.as_view()), #verifies otp and reset password
    path('profile/image/', ProfileImageUploadView.as_view(), name='profile-image'),
    path("change_password/", ChangePasswordView.as_view(), name="change-password"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    # path(
    #     'request-reset-otp/',
    #     RequestPasswordResetOtpView.as_view(),
    #     name='request-reset-otp'
    # ),

    # path(
    #     'verify-reset-otp/',
    #     VerifyOtpView.as_view(),
    #     name='verify-reset-otp'
    # ),

    # path(
    #     'reset-password/',
    #     ResetPasswordView.as_view(),
    #     name='reset-password'
    # ),
]