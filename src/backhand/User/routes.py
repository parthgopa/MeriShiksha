from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database('meri_shiksha')
users_collection = db.users

# Create blueprint
user_bp = Blueprint('user', __name__)

# Get user profile
@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    # Get user ID from JWT
    user_id = get_jwt_identity()
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    # Return user data (excluding password)
    return jsonify({
        'id': str(user['_id']),
        'name': user.get('name'),
        'email': user.get('email'),
        'role': user.get('role'),
        'phone': user.get('phone', ''),
        'first_logged_in': user.get('first_logged_in'),
        'last_logged_in': user.get('last_logged_in'),
        'login_count': user.get('login_count', 0),
        'created_at': user.get('created_at')
    }), 200


# Update user profile
@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    # Get user ID from JWT
    user_id = get_jwt_identity()
    data = request.get_json()
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    update_data = {}
    if 'name' in data:
        update_data['name'] = data['name']
    if 'email' in data:
        update_data['email'] = data['email'].lower()
    if 'phone' in data:
        update_data['phone'] = data['phone']
    if update_data:
        users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
    updated_user = users_collection.find_one({'_id': ObjectId(user_id)})
    return jsonify({
        'id': str(updated_user['_id']),
        'name': updated_user.get('name'),
        'email': updated_user.get('email'),
        'role': updated_user.get('role'),
        'phone': updated_user.get('phone', ''),
        'first_logged_in': updated_user.get('first_logged_in'),
        'last_logged_in': updated_user.get('last_logged_in'),
        'login_count': updated_user.get('login_count', 0),
        'created_at': updated_user.get('created_at')
    }), 200

