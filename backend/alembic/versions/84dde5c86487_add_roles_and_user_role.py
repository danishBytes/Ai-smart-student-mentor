
"""create roles and users tables

Revision ID: 84dde5c86487
Revises:
"""

import uuid
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "84dde5c86487"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # 1. Create roles table
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(50), nullable=False),
        sa.UniqueConstraint("name"),
    )

    op.create_index("ix_roles_id", "roles", ["id"], unique=False)

    # 2. Insert default roles
    connection = op.get_bind()

    connection.execute(
        sa.text("""
            INSERT INTO roles (id, name)
            VALUES
                (1, 'student'),
                (2, 'admin'),
                (3, 'super_admin')
        """)
    )

    # 3. Create users table
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("full_name", sa.String(100), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("role_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["role_id"], ["roles.id"]),
        sa.UniqueConstraint("email"),
    )

    op.create_index("ix_users_email", "users", ["email"], unique=True)


def downgrade() -> None:

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    op.drop_index("ix_roles_id", table_name="roles")
    op.drop_table("roles")
