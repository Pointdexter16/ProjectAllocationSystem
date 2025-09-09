from flask import Flask
from config import Config
from extensions import db
from routes.auth import auth_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)  # allow cross-origin requests from React dev server
    
    db.init_app(app)

    # ✅ Create tables immediately inside app context (Flask 3.x safe)
    with app.app_context():
        db.create_all()

    # Register blueprints
    app.register_blueprint(auth_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
