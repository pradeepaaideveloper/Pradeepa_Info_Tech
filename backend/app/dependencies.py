import logging
from typing import List
from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .models.user import User
from .services.auth_service import verify_token
from .errors import AppException

logger = logging.getLogger("app")

# HTTPBearer security scheme
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get the current logged-in user from the JWT access token.
    """
    token = credentials.credentials
    # Verify access token and get user ID
    user_id_str = verify_token(token, expected_type="access")
    
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise AppException(
            code="INVALID_TOKEN",
            message="Token contains invalid subject",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise AppException(
            code="USER_NOT_FOUND",
            message="The user owning this token was not found",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    return user

class RoleChecker:
    """
    Dependency class to verify if the authenticated user has one of the allowed roles.
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles:
            logger.warning(
                f"Unauthorized access attempt by user {current_user.email} (Role: {current_user.role}) "
                f"to resource requiring one of: {self.allowed_roles}"
            )
            raise AppException(
                code="FORBIDDEN",
                message="You do not have permission to perform this action",
                status_code=status.HTTP_403_FORBIDDEN
            )
        return current_user
