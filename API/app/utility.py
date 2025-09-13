import bcrypt
import jwt # remove if not in use check
import datetime

from fastapi import Depends, HTTPException, status, Request, Security
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session
from app.database import get_db  # your DB dependency
from app import models
from fastapi.security import APIKeyHeader
from app.models import Users
from sqlalchemy.inspection import inspect


from app.config import SECRET_KEY, ALGORITHM


api_key_header = APIKeyHeader(name="Authorization")

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt.

    Args:
        password: The plain-text password string.

    Returns:
        The hashed password string, encoded for storage.
    """
    # The password must be encoded to bytes before hashing.
    password_bytes = password.encode('utf-8')
    # Generate a salt and hash the password in one step.
    # bcrypt.gensalt() handles generating a strong salt.
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    # The result is a byte string; decode it back to a string for storage.
    return hashed_bytes.decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    """
    Checks if a plain-text password matches a stored hashed password.

    Args:
        password: The plain-text password string to check.
        hashed_password: The stored hashed password string.

    Returns:
        True if the passwords match, False otherwise.
    """
    # Both the plain password and the stored hash must be encoded to bytes for comparison.
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))



def generate_token(user_id: int, expires_minutes: int = 60) -> str:
    """
    Generates a JWT token for a user with an expiration time.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes),
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    if isinstance(token, bytes):
        token = token.decode('utf-8')  # for old pyjwt
    return token


def token_required(auth_header: str = Security(api_key_header), db: Session = Depends(get_db)):
    # auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must be: Bearer <token>"
        )

    token = parts[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: user_id missing"
            )

        # Query DB for user
        user = db.query(models.Users).filter_by(Staff_id=user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: user not found"
            )
        return user

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
def check_user(user,db):
    db_user = db.query(Users).filter(Users.Email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.Password_hash.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    token=generate_token(db_user.Staff_id)
    return token, db_user

def filter_model_fields(data: dict, model):
    model_columns = {c.key for c in inspect(model).mapper.column_attrs}
    return {k: v for k, v in data.items() if k in model_columns}