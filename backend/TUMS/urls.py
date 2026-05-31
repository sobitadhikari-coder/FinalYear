from django.contrib import admin
from django.urls import path,include

from app.authenticate.views.change_password import ChangePasswordView
from app.authenticate.views.pass_views import RequestPasswordResetView, VerifyResetOTPView
from app.authenticate.views.profile_views import ProfileImageUploadView, ProfileView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.authenticate.urls')),
    path('api/', include('app.teacher.urls')),
    path('api-stu/', include('app.student.urls')),
]
