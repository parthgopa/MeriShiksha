from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from functools import wraps

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database('meri_shiksha')
users_collection = db.users

# Create blueprint
admin_bp = Blueprint('admin', __name__)

# Admin middleware
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Find user by ID
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        # Check if user is admin
        if not user or user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return fn(*args, **kwargs)
    
    return wrapper

# Get all users (admin only)
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    # Get all users
    users = list(users_collection.find())
    
    # Format user data
    formatted_users = []
    for user in users:
        formatted_users.append({
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        })
    
    return jsonify(formatted_users), 200

# Get user by ID (admin only)
@admin_bp.route('/users/<user_id>', methods=['GET'])
@admin_required
def get_user(user_id):
    # Find user by ID
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
    except:
        return jsonify({'error': 'Invalid user ID'}), 400
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Return user data
    return jsonify({
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'role': user['role']
    }), 200

# Update user (admin only)
@admin_bp.route('/users/<user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    # Get request data
    data = request.get_json()
    
    # Find user by ID
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
    except:
        return jsonify({'error': 'Invalid user ID'}), 400
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Update user data
    update_data = {}
    if 'name' in data:
        update_data['name'] = data['name']
    if 'role' in data:
        update_data['role'] = data['role']
    
    if update_data:
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
    
    # Get updated user
    updated_user = users_collection.find_one({'_id': ObjectId(user_id)})
    
    # Return updated user data
    return jsonify({
        'id': str(updated_user['_id']),
        'name': updated_user['name'],
        'email': updated_user['email'],
        'role': updated_user['role']
    }), 200

# Delete user (admin only)
@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    # Find user by ID
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
    except:
        return jsonify({'error': 'Invalid user ID'}), 400
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Delete user
    users_collection.delete_one({'_id': ObjectId(user_id)})
    
    return jsonify({'message': 'User deleted successfully'}), 200
