# app.py
from flask import Flask
from models import db
from routes import register_routes

app = Flask(__name__)

# Database config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///event.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize db
db.init_app(app)

# Register all routes
register_routes(app)

# Create tables
with app.app_context():
    db.create_all()

# Run app
if __name__ == "__main__":
    app.run(debug=True)
