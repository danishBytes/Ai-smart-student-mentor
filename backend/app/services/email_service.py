
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


def send_otp_email(to_email: str, otp: str) -> bool:
    """Send OTP to the user's email address."""

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("SMTP_FROM_EMAIL")

    if not all([
        smtp_host,
        smtp_username,
        smtp_password,
        from_email
    ]):
        raise RuntimeError("SMTP configuration is incomplete.")

    message = EmailMessage()
    message["Subject"] = "Trialshopy - Email Verification"
    message["From"] = from_email
    message["To"] = to_email

    message.set_content(f"""
Hello,

Welcome to Trialshopy!

Your email verification OTP is: {otp}

This OTP is valid for 5 minutes.

Please do not share this OTP with anyone.

Regards,
Trialshopy Team
""")

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_username, smtp_password)
            server.send_message(message)

        return True

    except (smtplib.SMTPException, OSError) as error:
        raise RuntimeError("Unable to send verification email.") from error

def send_password_reset_email(to_email: str, otp: str) -> bool:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("SMTP_FROM_EMAIL")

    if not all([smtp_host, smtp_username, smtp_password, from_email]):
        raise RuntimeError("SMTP configuration is incomplete.")

    message = EmailMessage()
    message["Subject"] = "Trialshopy - Password Reset"
    message["From"] = from_email
    message["To"] = to_email

    message.set_content(f"""
Hello,

We received a request to reset your Trialshopy password.

Your password reset OTP is: {otp}

This OTP is valid for 5 minutes.
Do not share this OTP with anyone.

If you did not request this reset, you can ignore this email.

Regards,
Trialshopy Team
""")

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_username, smtp_password)
            server.send_message(message)

        return True

    except (smtplib.SMTPException, OSError) as error:
        raise RuntimeError("Unable to send password reset email.") from error
