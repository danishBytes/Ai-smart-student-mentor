
import secrets
from datetime import datetime, timedelta, timezone

from app.core.security import hash_password, verify_password


OTP_EXPIRY_MINUTES = 5


def generate_otp() -> str:
    """Generate a cryptographically secure 6-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    """Hash OTP before storing it."""
    return hash_password(otp)


def verify_otp(otp: str, otp_hash: str) -> bool:
    """Verify entered OTP against its stored hash."""
    return verify_password(otp.strip(), otp_hash)


def get_otp_expiry():
    """Return OTP expiry timestamp."""
    return datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRY_MINUTES
    )
