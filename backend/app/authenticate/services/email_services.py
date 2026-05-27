from django.core.mail import send_mail

def send_otp_email(user, otp):
    send_mail(
        subject="Password Reset OTP",
        message=f"""Your OTP is {otp}. It will expire in 5 minutes. 
                            If you did not request this, please ignore this email.""",
        from_email="sobit.bntech@gmail.com",
        recipient_list=[user.email],
        fail_silently=False,
    )