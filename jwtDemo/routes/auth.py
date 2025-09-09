from flask import Blueprint, request, jsonify, g
from extensions import db
from models import User
from utils.auth_utils import hash_password, verify_password, generate_token, token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "username, email and password are required"}), 400

    # Check existing user
    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"message": "User with that email or username already exists"}), 400

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password)
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)
    return jsonify({"message": "User created", "user": user.to_dict(), "token": token}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_token(user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def me():
    user = g.current_user
    return jsonify({"user": user.to_dict()}), 200
