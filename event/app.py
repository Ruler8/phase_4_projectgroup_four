from flask import Flask
from models import db
from routes import register_routes
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///event.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database with app
db.init_app(app)

# Register app routes
register_routes(app)

if __name__ == "__main__":
    # Create tables and run app
    with app.app_context():
        db.create_all()
    app.run(debug=True)
