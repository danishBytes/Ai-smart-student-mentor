from fastapi import APIRouter, Depends

from app.core.permissions import require_super_admin
from app.models.user import User

router = APIRouter(
    prefix="/super-admin",
    tags=["Super Admin"]
)


@router.get("/dashboard")
def super_admin_dashboard(
    current_user: User = Depends(require_super_admin)
):
    return {
        "message": "Super Admin access granted",
        "admin": current_user.full_name,
        "role": current_user.role.name
    }