import os
from pydantic_settings import BaseSettings
from pydantic import EmailStr

class Settings(BaseSettings):
    # App General Settings
    APP_NAME: str = "Pradeepa Info Tech API"
    DEBUG: bool = False
    API_V1_STR: str = "/api"
    
    # Security & Authentication
    SECRET_KEY: str = "SUPER_SECRET_JWT_KEY_FOR_PRADEEPA_INFO_TECH_12345!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database Configuration
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/pradeepadb"
    
    # SMTP / Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "info@pradeepainfotech.com"
    SMTP_PASSWORD: str = ""
    SMTP_FROM: EmailStr = "info@pradeepainfotech.com"
    SMTP_FROM_NAME: str = "Pradeepa Info Tech"
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    # Razorpay Payment Gateway Configuration
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    
    # AI Chatbot Configuration
    GEMINI_API_KEY: str = ""
    
    # Backups Settings
    BACKUP_DIR: str = "c:\\Downloads\\own\\backups"
    
    # Admin Credentials for seed database
    DEFAULT_ADMIN_EMAIL: EmailStr = "admin@pradeepainfotech.com"
    DEFAULT_ADMIN_PASSWORD: str = "Admin@Pradeepa123"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
