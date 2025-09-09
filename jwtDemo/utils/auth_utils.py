from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps
from flask import request, jsonify, current_app, g
import datetime

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def verify_password(hash_pw: str, password: str) -> bool:
    return check_password_hash(hash_pw, password)

def generate_token(user_id: int, expires_minutes: int = 60) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes),
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm="HS256")
    # pyjwt v1 may return bytes — ensure string
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return jsonify({"message": "Authorization header missing"}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"message": "Authorization header must be: Bearer <token>"}), 401

        token = parts[1]
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = payload.get("user_id")
            # import here to avoid circular imports at module import time
            from models import User
            user = User.query.get(user_id)
            if not user:
                return jsonify({"message": "Invalid token: user not found"}), 401
            g.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated
