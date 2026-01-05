from flask import Flask, request, jsonify
from flask_cors import CORS
# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
# from pymongo import MongoClient
# from datetime import timedelta

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
# bcrypt = Bcrypt(app)

# Configure JWT
# app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'meri_shiksha_secret_key')
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
# jwt = JWTManager(app)

# Connect to MongoDB
# mongo_uri = os.environ.get('MONGO_URI')
# client = MongoClient(mongo_uri)
# db = client.get_database('meri_shiksha')

# print("MongoDB connected : ", mongo_uri)

# Import routes
from services.gemini_service import call_gemini_api

@app.route('/api/gemini', methods=['POST'])
def gemini_api():
    try:
        data = request.get_json()
        question = data.get('question')
        
        # Use the gemini service to handle the API call
        result = call_gemini_api(question)
        
        # Check if it's an error response (4xx status codes)
        if question is None:
            return jsonify(result), 400
            
        return jsonify(result)
        
    except Exception as e:
        print(f"Unexpected error in gemini endpoint: {e}")
        return jsonify({
            'candidates': [{
                'content': {
                    'parts': [{
                        'text': "An unexpected error occurred. Please try again later."
                    }]
                }
            }]
        })

# Root route
@app.route('/')
def index():
    return jsonify({'message': 'MeriShiksha API is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
