
from getpass import getpass

from sqlalchemy.exc import IntegrityError

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.role import Role


def create_super_admin():
    db = SessionLocal()

    try:
        print("\n=== Trialshopy Super Admin Setup ===\n")

        full_name = input("Enter full name: ").strip()
        email = input("Enter email: ").strip().lower()

        if not full_name or not email:
            print("Name and email are required.")
            return

        # Check whether account already exists
        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            print("An account with this email already exists.")
            print("No existing account was modified.")
            return

        # Find Super Admin role
        super_admin_role = db.query(Role).filter(
            Role.name == "super_admin"
        ).first()

        if not super_admin_role:
            print("Super Admin role not found in database.")
            return

        # Secure password input
        password = getpass("Enter password (minimum 12 characters): ")
        confirm_password = getpass("Confirm password: ")

        if len(password) < 12:
            print("Password must contain at least 12 characters.")
            return

        if password != confirm_password:
            print("Passwords do not match.")
            return

        # Create Super Admin account
        admin = User(
            full_name=full_name,
            email=email,
            hashed_password=hash_password(password),
            role_id=super_admin_role.id,
            is_active=True,
            is_verified=False
        )

        db.add(admin)
        db.commit()

        print("\nSuper Admin account created successfully!")
        print(f"Name: {admin.full_name}")
        print(f"Email: {admin.email}")
        print("Role: super_admin")

    except IntegrityError:
        db.rollback()
        print("Account creation failed: email may already exist.")

    except Exception as error:
        db.rollback()
        print(f"Something went wrong: {error}")

    finally:
        db.close()


if __name__ == "__main__":
    create_super_admin()
