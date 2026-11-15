from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_refresh_token,
    hash_refresh_token,
    get_refresh_token_expiry
)

from app.models.user import User
from app.models.role import Role
from app.models.email_verification import EmailVerification
from app.models.refresh_session import RefreshSession
from app.models.password_reset import PasswordReset

from app.schemas.user import UserRegister, UserLogin
from app.schemas.auth import (
    EmailRequest,
    VerifyEmailRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    GoogleLoginRequest,
    RefreshTokenRequest
)

from app.services.otp_service import (
    create_otp,
    verify_otp_from_db
)

from app.services.password_reset_service import (
    create_password_reset_otp,
    verify_password_reset_otp
)

from app.services.email_service import (
    send_otp_email,
    send_password_reset_email
)

from app.services.google_auth_service import verify_google_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# --------------------------------------------------
# HELPER: GENERATE AND SAVE TOKENS
# --------------------------------------------------

def create_user_tokens(db: Session, user: User):
    access_token = create_access_token(str(user.id))
    refresh_token = generate_refresh_token()

    refresh_session = RefreshSession(
        user_id=user.id,
        token_hash=hash_refresh_token(refresh_token),
        expires_at=get_refresh_token_expiry()
    )

    try:
        db.add(refresh_session)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create login session"
        )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


# --------------------------------------------------
# REFRESH ACCESS TOKEN
# --------------------------------------------------

@router.post("/refresh")
def refresh_access_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    incoming_hash = hash_refresh_token(request.refresh_token)

    session = db.query(RefreshSession).filter(
        RefreshSession.token_hash == incoming_hash
    ).with_for_update().first()

    if (
        not session
        or session.revoked_at is not None
        or session.expires_at <= now
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    user = db.query(User).filter(
        User.id == session.user_id
    ).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is unavailable"
        )

    new_access_token = create_access_token(str(user.id))
    new_refresh_token = generate_refresh_token()

    session.revoked_at = now

    new_session = RefreshSession(
        user_id=user.id,
        token_hash=hash_refresh_token(new_refresh_token),
        expires_at=get_refresh_token_expiry()
    )

    try:
        db.add(new_session)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to refresh authentication session"
        )

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


# --------------------------------------------------
# LOGOUT USER (NEW ENDPOINT)
# --------------------------------------------------

@router.post("/logout")
def logout_user(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)

    incoming_hash = hash_refresh_token(request.refresh_token)

    session = db.query(RefreshSession).filter(
        RefreshSession.token_hash == incoming_hash
    ).with_for_update().first()

    if (
        not session
        or session.revoked_at is not None
        or session.expires_at <= now
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    try:
        session.revoked_at = now
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to logout. Please try again."
        )

    return {
        "message": "Logged out successfully"
    }


# --------------------------------------------------
# REGISTER USER
# --------------------------------------------------

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered"
        )

    student_role = db.query(Role).filter(
        Role.name == "student"
    ).first()

    if not student_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Default student role is not configured"
        )

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role_id=student_role.id,
        is_verified=False
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered"
        )

    try:
        otp = create_otp(db, new_user.id)
        send_otp_email(new_user.email, otp)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(error)
        )
    except RuntimeError:
        db.query(EmailVerification).filter(
            EmailVerification.user_id == new_user.id
        ).delete(synchronize_session=False)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Account created, but verification email "
                "could not be sent. Please try again later."
            )
        )

    return {
        "message": "Registration successful. Please verify your email.",
        "email": new_user.email,
        "is_verified": new_user.is_verified
    }


# --------------------------------------------------
# VERIFY EMAIL OTP
# --------------------------------------------------

@router.post("/verify-email")
def verify_email(
    verification_data: VerifyEmailRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == verification_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )

    success, message = verify_otp_from_db(
        db,
        user.id,
        verification_data.otp
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    user.is_verified = True

    db.commit()
    db.refresh(user)

    return {
        "message": "Email verified successfully.",
        "email": user.email,
        "is_verified": True
    }


# --------------------------------------------------
# JSON LOGIN
# --------------------------------------------------

@router.post("/login")
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in."
        )

    tokens = create_user_tokens(db, user)

    return {
        **tokens,
        "user": {
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.name
        }
    }


# --------------------------------------------------
# SWAGGER OAUTH2 TOKEN LOGIN
# --------------------------------------------------

@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return create_user_tokens(db, user)


# --------------------------------------------------
# RESEND EMAIL OTP
# --------------------------------------------------

@router.post("/resend-otp")
def resend_otp(
    email_data: EmailRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == email_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )

    try:
        otp = create_otp(db, user.id)
        send_otp_email(user.email, otp)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(error)
        )
    except RuntimeError:
        db.query(EmailVerification).filter(
            EmailVerification.user_id == user.id
        ).delete(synchronize_session=False)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to send OTP. Please try again later."
        )

    return {
        "message": "A new OTP has been sent to your email.",
        "email": user.email
    }


# --------------------------------------------------
# FORGOT PASSWORD
# --------------------------------------------------

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    generic_response = {
        "message": (
            "If an eligible account exists, "
            "a password reset OTP has been sent."
        )
    }

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user or not user.is_active:
        return generic_response

    try:
        otp = create_password_reset_otp(db, user.id)
        send_password_reset_email(user.email, otp)
    except ValueError:
        return generic_response
    except RuntimeError:
        db.query(PasswordReset).filter(
            PasswordReset.user_id == user.id
        ).delete(synchronize_session=False)
        db.commit()
        return generic_response

    return generic_response


# --------------------------------------------------
# RESET PASSWORD
# --------------------------------------------------

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset request."
        )

    success, message = verify_password_reset_otp(
        db,
        user.id,
        request.otp
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    try:
        user.hashed_password = hash_password(
            request.new_password
        )

        db.query(PasswordReset).filter(
            PasswordReset.user_id == user.id
        ).delete(synchronize_session=False)

        now = datetime.now(timezone.utc)

        db.query(RefreshSession).filter(
            RefreshSession.user_id == user.id,
            RefreshSession.revoked_at.is_(None)
        ).update(
            {"revoked_at": now},
            synchronize_session=False
        )

        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to reset password. Please try again."
        )

    return {
        "message": (
            "Password reset successfully. "
            "Please login with your new password."
        )
    }


# --------------------------------------------------
# GOOGLE LOGIN
# --------------------------------------------------

@router.post("/google")
def google_login(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    try:
        google_user = verify_google_token(request.id_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google token"
        )
    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google authentication is not configured"
        )

    google_sub = google_user["sub"]
    email = google_user["email"].strip().lower()
    full_name = google_user.get("name") or email.split("@")[0]

    user = db.query(User).filter(
        User.google_sub == google_sub
    ).first()

    if user:
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
    else:
        user = db.query(User).filter(
            User.email == email
        ).first()

        if user:
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account is inactive"
                )

            if user.google_sub and user.google_sub != google_sub:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="This account is linked to another Google account"
                )

            user.google_sub = google_sub
            user.is_verified = True
        else:
            student_role = db.query(Role).filter(
                Role.name == "student"
            ).first()

            if not student_role:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Student role is not configured"
                )

            user = User(
                full_name=full_name,
                email=email,
                google_sub=google_sub,
                hashed_password=None,
                role_id=student_role.id,
                is_active=True,
                is_verified=True
            )

            db.add(user)

        try:
            db.commit()
            db.refresh(user)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account already exists or Google account is linked elsewhere"
            )
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to create Google login account"
            )

    tokens = create_user_tokens(db, user)

    return {
        **tokens,
        "user": {
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.name
        }
    }