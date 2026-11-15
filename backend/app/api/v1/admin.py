from fastapi import APIRouter, Depends

from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard(
    current_user: User = Depends(require_admin)
):
    return {
        "message": "Admin access granted",
        "admin": current_user.full_name,
        "role": current_user.role.name
    }