
"""add roles and user role

Revision ID: 84dde5c86487
Revises:
Create Date: 2026-11-14 12:35:53.197740
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "84dde5c86487"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # 1. Create roles table
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_index(
        "ix_roles_id",
        "roles",
        ["id"],
        unique=False,
    )

    # 2. Insert default roles
    connection = op.get_bind()

    connection.execute(
        sa.text("""
            INSERT INTO roles (name)
            VALUES ('student'), ('admin'), ('super_admin')
        """)
    )

    # 3. Add role_id as nullable first
    op.add_column(
        "users",
        sa.Column("role_id", sa.Integer(), nullable=True),
    )

    # 4. Add foreign key
    op.create_foreign_key(
        "fk_users_role_id_roles",
        "users",
        "roles",
        ["role_id"],
        ["id"],
    )

    # 5. Assign existing users the student role
    student_id = connection.execute(
        sa.text("SELECT id FROM roles WHERE name = 'student'")
    ).scalar_one()

    connection.execute(
        sa.text("""
            UPDATE users
            SET role_id = :student_id
            WHERE role_id IS NULL
        """),
        {"student_id": student_id},
    )

    # 6. Make role_id mandatory
    op.alter_column(
        "users",
        "role_id",
        existing_type=sa.Integer(),
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "fk_users_role_id_roles",
        "users",
        type_="foreignkey",
    )

    op.drop_column("users", "role_id")

    op.drop_index("ix_roles_id", table_name="roles")

    op.drop_table("roles")
