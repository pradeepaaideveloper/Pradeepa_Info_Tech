import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger("app")

# Base Custom Exception
class AppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, details: dict = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", details: dict = None):
        super().__init__("NOT_FOUND", message, status.HTTP_404_NOT_FOUND, details)

class DatabaseException(AppException):
    def __init__(self, message: str = "Database operation failed", details: dict = None):
        super().__init__("DATABASE_ERROR", message, status.HTTP_500_INTERNAL_SERVER_ERROR, details)

# Exception Handlers
def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.error(f"Application Error [{exc.code}]: {exc.message} | Details: {exc.details}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )

def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    details = {}
    for error in exc.errors():
        loc = ".".join(str(x) for x in error.get("loc", []))
        details[loc] = error.get("msg", "Validation error")
        
    logger.warning(f"Request Validation Error: {details}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed",
                "details": details
            }
        }
    )

def db_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    logger.error(f"Database Error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "DATABASE_ERROR",
                "message": "A database operation error occurred. Please contact administrator.",
                "details": {}
            }
        }
    )

def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.critical(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred.",
                "details": {}
            }
        }
    )

def register_error_handlers(app):
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, db_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
