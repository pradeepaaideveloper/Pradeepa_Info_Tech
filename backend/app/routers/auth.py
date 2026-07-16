import logging
from datetime import timedelta
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.marketing import Cart
from ..schemas.user import UserCreate, UserResponse, LoginRequest, TokenResponse, TokenRefreshRequest, MessageResponse
from ..services.auth_service import hash_password, verify_password, create_access_token, create_refresh_token, verify_token
from ..dependencies import get_current_user
from ..errors import AppException

logger = logging.getLogger("app")
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account (Customer, Student, Trainer, Cashier, Admin).
    Checks for email conflicts and hashes password using bcrypt.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise AppException(
            code="EMAIL_CONFLICT",
            message="An account with this email address already exists",
            status_code=status.HTTP_409_CONFLICT
        )
    
    # Secure role inputs (restrict admin creation if needed, but allow for simple setup)
    # Default to customer if not specified or invalid
    allowed_roles = ["customer", "student", "trainer", "admin", "cashier"]
    role = user_in.role if user_in.role in allowed_roles else "customer"

    # Create new user
    new_user = User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=role,
        is_verified=False # Email verification would toggle this
    )
    
    db.add(new_user)
    db.flush() # Flush to populate ID
    
    # Initialize an empty shopping cart for the new user
    user_cart = Cart(user_id=new_user.id)
    db.add(user_cart)
    
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"New user registered: {new_user.email} (Role: {new_user.role})")
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(login_in: LoginRequest, db: Session = Depends(get_db)):
    """
    Log in with email and password. Returns Access Token, Refresh Token, and User Profile.
    """
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise AppException(
            code="INVALID_CREDENTIALS",
            message="Incorrect email or password",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    # Generate tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    logger.info(f"User logged in successfully: {user.email}")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/refresh", response_model=TokenResponse)
def refresh(refresh_in: TokenRefreshRequest, db: Session = Depends(get_db)):
    """
    Get a new access token using a valid refresh token.
    """
    user_id_str = verify_token(refresh_in.refresh_token, expected_type="refresh")
    user_id = int(user_id_str)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise AppException(
            code="USER_NOT_FOUND",
            message="User owning the refresh token no longer exists",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    # Generate new tokens
    new_access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get the profile information of the current authenticated user.
    """
    return current_user
