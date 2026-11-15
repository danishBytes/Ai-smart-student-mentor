
import os

from google.auth.transport import requests
from google.oauth2 import id_token


def verify_google_token(token: str) -> dict:
    """
    Verify a Google ID token and return its trusted payload.
    """

    client_id = os.getenv("GOOGLE_CLIENT_ID")

    if not client_id:
        raise RuntimeError("GOOGLE_CLIENT_ID is not configured.")

    try:
        payload = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            client_id
        )

        # Ensure Google has verified the user's email.
        if not payload.get("email_verified"):
            raise ValueError("Google email is not verified.")

        # Required identity fields.
        if not payload.get("sub") or not payload.get("email"):
            raise ValueError("Google token is missing required user information.")

        return payload

    except ValueError:
        raise
    except Exception as exc:
        raise ValueError("Invalid or expired Google ID token.") from exc
