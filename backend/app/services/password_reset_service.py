
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.password_reset import PasswordReset
from app.core.otp import generate_otp, hash_otp, verify_otp


OTP_EXPIRY_MINUTES = 5
OTP_RESEND_COOLDOWN_SECONDS = 60
MAX_OTP_ATTEMPTS = 5


def create_password_reset_otp(db: Session, user_id):

    now = datetime.now(timezone.utc)

    recent_otp = (
        db.query(PasswordReset)
        .filter(PasswordReset.user_id == user_id)
        .order_by(PasswordReset.created_at.desc())
        .first()
    )

    if recent_otp:
        created_at = recent_otp.created_at

        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        elapsed = (now - created_at).total_seconds()

        if elapsed < OTP_RESEND_COOLDOWN_SECONDS:
            remaining = int(
                OTP_RESEND_COOLDOWN_SECONDS - elapsed
            )
            raise ValueError(
                f"Please wait {remaining} seconds before requesting another OTP."
            )

    # Remove previous OTP
    db.query(PasswordReset).filter(
        PasswordReset.user_id == user_id
    ).delete(synchronize_session=False)

    otp = generate_otp()
    otp_hash = hash_otp(otp)
    otp_hash = hash_otp(otp)

    print("OTP self-check:", verify_otp(otp, otp_hash))

    # Internal consistency check: never log the OTP
    if not verify_otp(otp, otp_hash):
        db.rollback()
        raise RuntimeError("OTP hashing verification failed.")

    reset_record = PasswordReset(
        user_id=user_id,
        otp_hash=otp_hash,
        expires_at=now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        attempts=0
    )

    db.add(reset_record)
    db.commit()

    return otp


def verify_password_reset_otp(
    db: Session,
    user_id,
    entered_otp: str
):

    reset_record = (
        db.query(PasswordReset)
        .filter(PasswordReset.user_id == user_id)
        .with_for_update()
        .first()
    )

    if not reset_record:
        return False, "No reset OTP found. Please request a new OTP."

    now = datetime.now(timezone.utc)

    expires_at = reset_record.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now >= expires_at:
        db.delete(reset_record)
        db.commit()
        return False, "OTP has expired. Please request a new OTP."

    if reset_record.attempts >= MAX_OTP_ATTEMPTS:
        db.delete(reset_record)
        db.commit()
        return False, "Maximum attempts reached. Please request a new OTP."

    if not verify_otp(entered_otp, reset_record.otp_hash):
        reset_record.attempts += 1
        db.commit()
        return False, "Invalid OTP. Please try again."

    return True, "OTP verified successfully."
