from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.email_verification import EmailVerification
from app.core.otp import generate_otp, hash_otp, verify_otp as check_otp


OTP_RESEND_COOLDOWN_SECONDS = 60
OTP_EXPIRY_MINUTES = 5


def create_otp(db: Session, user_id):
    """Create and store a new OTP for a user."""

    now = datetime.now(timezone.utc)

    # Check resend cooldown
    recent_otp = (
        db.query(EmailVerification)
        .filter(EmailVerification.user_id == user_id)
        .order_by(EmailVerification.created_at.desc())
        .first()
    )

    if recent_otp:
        elapsed = (now - recent_otp.created_at).total_seconds()

        if elapsed < OTP_RESEND_COOLDOWN_SECONDS:
            remaining = int(OTP_RESEND_COOLDOWN_SECONDS - elapsed)
            raise ValueError(
                f"Please wait {remaining} seconds before requesting another OTP."
            )

    # Remove previous OTP records
    db.query(EmailVerification).filter(
        EmailVerification.user_id == user_id
    ).delete(synchronize_session=False)

    # Generate and hash OTP
    otp = generate_otp()
    otp_hash = hash_otp(otp)

    verification = EmailVerification(
        user_id=user_id,
        otp_hash=otp_hash,
        expires_at=now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        attempts=0
    )

    db.add(verification)
    db.commit()

    return otp


def verify_otp_from_db(db: Session, user_id, entered_otp: str):
    """Verify OTP stored for a user."""
    verification = (
        db.query(EmailVerification)
        .filter(EmailVerification.user_id == user_id)
        .with_for_update()
        .first()
    )

    if not verification:
        return False, "No OTP found. Please request a new OTP."

    now = datetime.now(timezone.utc)

    # Check expiry (No need for replace since model has timezone=True)
    if now >= verification.expires_at:
        db.delete(verification)
        db.commit()
        return False, "OTP has expired. Please request a new OTP."

    # Check maximum attempts
    if verification.attempts >= 5:
        db.delete(verification)
        db.commit()
        return False, "Maximum attempts reached. Please request a new OTP."

    # Verify entered OTP
    if not check_otp(entered_otp, verification.otp_hash):
        verification.attempts += 1
        db.commit()
        return False, "Invalid OTP. Please try again."

    # OTP verified successfully
    db.delete(verification)
    db.commit()
    return True, "Email verified successfully."