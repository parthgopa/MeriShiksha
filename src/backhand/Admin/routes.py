from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from functools import wraps
from datetime import datetime

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database('meri_shiksha')
users_collection = db.users
subscriptions_collection = db.subscriptions

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
            'role': user['role'],
            'max_api_calls': user.get('max_api_calls', 0),
            'subscription_plan': user.get('subscription_plan', 'free'),
            'subscription_end_date': user.get('subscription_end_date'),
            'created_at': user.get('created_at')
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
        'role': user['role'],
        'max_api_calls': user.get('max_api_calls', 0),
        'subscription_plan': user.get('subscription_plan', 'free'),
        'subscription_end_date': user.get('subscription_end_date'),
        'created_at': user.get('created_at')
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
    if 'max_api_calls' in data:
        update_data['max_api_calls'] = data['max_api_calls']
    if 'subscription_plan' in data:
        update_data['subscription_plan'] = data['subscription_plan']
    if 'subscription_end_date' in data:
        update_data['subscription_end_date'] = data['subscription_end_date']
    
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
        'role': updated_user['role'],
        'max_api_calls': updated_user.get('max_api_calls', 0),
        'subscription_plan': updated_user.get('subscription_plan', 'free'),
        'subscription_end_date': updated_user.get('subscription_end_date')
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

# Get all subscriptions (admin only)
@admin_bp.route('/subscriptions', methods=['GET'])
@admin_required
def get_subscriptions():
    # Get all subscriptions
    subscriptions = list(subscriptions_collection.find())
    
    # Format subscription data
    formatted_subscriptions = []
    for subscription in subscriptions:
        # Get user info
        user = users_collection.find_one({'_id': ObjectId(subscription['user_id'])})
        user_name = user['name'] if user else 'Unknown'
        user_email = user['email'] if user else 'Unknown'
        
        formatted_subscriptions.append({
            'id': str(subscription['_id']),
            'user_id': subscription['user_id'],
            'user_name': user_name,
            'user_email': user_email,
            'plan': subscription.get('plan'),
            'amount': subscription.get('amount'),
            'start_date': subscription.get('start_date'),
            'end_date': subscription.get('end_date'),
            'created_at': subscription.get('created_at')
        })
    
    return jsonify(formatted_subscriptions), 200

# Add API calls to user (admin only)
@admin_bp.route('/add-api-calls/<user_id>', methods=['POST'])
@admin_required
def add_api_calls(user_id):
    data = request.get_json()
    
    if 'amount' not in data:
        return jsonify({'error': 'Amount of API calls is required'}), 400
    
    try:
        amount = int(data['amount'])
    except:
        return jsonify({'error': 'Amount must be an integer'}), 400
    
    # Find user by ID
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
    except:
        return jsonify({'error': 'Invalid user ID'}), 400
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get current API call count
    current_calls = user.get('max_api_calls', 0)
    
    # If user has unlimited calls (-1), don't change it
    if current_calls == -1:
        return jsonify({
            'message': 'User already has unlimited API calls',
            'max_api_calls': -1
        }), 200
    
    # Add API calls
    new_calls = current_calls + amount
    
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'max_api_calls': new_calls}}
    )
    
    return jsonify({
        'message': f'Added {amount} API calls to user',
        'max_api_calls': new_calls
    }), 200
