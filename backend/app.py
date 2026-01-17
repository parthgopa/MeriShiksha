from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import blueprints
from api import api_bp

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:5174","https://merishiksha.com",],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints with proper URL prefixes
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({
        "message": "MeriShiksha Backend API",
        "endpoints": {
            "gemini": "/api/gemini"
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
