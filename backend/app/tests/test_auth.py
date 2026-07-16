import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..database import Base, get_db
from ..main import app
from ..models.user import User

# Test database: SQLite in-memory
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_pradeepa.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database dependency in app
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create all tables before running tests
    Base.metadata.create_all(bind=engine)
    yield
    # Drop all tables after running tests
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_user_registration_and_login():
    # 1. Register a new user
    register_payload = {
        "email": "testuser@pradeepainfotech.com",
        "password": "Password123!",
        "full_name": "Test User",
        "phone": "9876543210",
        "role": "customer"
    }
    response = client.post("/api/auth/register", json=register_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == register_payload["email"]
    assert data["full_name"] == register_payload["full_name"]
    assert "id" in data
    assert data["role"] == "customer"
    
    # 2. Attempt duplicate registration
    dup_response = client.post("/api/auth/register", json=register_payload)
    assert dup_response.status_code == 409
    assert dup_response.json()["error"]["code"] == "EMAIL_CONFLICT"
    
    # 3. Log in with correct credentials
    login_payload = {
        "email": "testuser@pradeepainfotech.com",
        "password": "Password123!"
    }
    login_response = client.post("/api/auth/login", json=login_payload)
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert "refresh_token" in login_data
    assert login_data["token_type"] == "bearer"
    assert login_data["user"]["email"] == register_payload["email"]
    
    # Save token for next steps
    access_token = login_data["access_token"]
    refresh_token = login_data["refresh_token"]
    
    # 4. Access protected profile route (/auth/me) with token
    headers = {"Authorization": f"Bearer {access_token}"}
    me_response = client.get("/api/auth/me", headers=headers)
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["email"] == register_payload["email"]
    
    # 5. Access profile route with invalid token
    invalid_headers = {"Authorization": "Bearer invalidtoken123"}
    bad_response = client.get("/api/auth/me", headers=invalid_headers)
    assert bad_response.status_code == 401
    
    # 6. Refresh tokens
    refresh_payload = {"refresh_token": refresh_token}
    refresh_response = client.post("/api/auth/refresh", json=refresh_payload)
    assert refresh_response.status_code == 200
    refresh_data = refresh_response.json()
    assert "access_token" in refresh_data
    assert "refresh_token" in refresh_data
