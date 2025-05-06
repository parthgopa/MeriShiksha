from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from bson.objectid import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from functools import wraps
from datetime import datetime
import re

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database('meri_shiksha')
users_collection = db.users
admin_register_collection = db.admin_register

# Initialize subscription toggle collection
subscription_enable_collection = db.subscription_enable

# Create blueprint
admin_bp = Blueprint('admin', __name__)

# Admin middleware
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # First check if user is in admin_register collection
        admin = admin_register_collection.find_one({'_id': ObjectId(user_id)})
        if admin:
            return fn(*args, **kwargs)
            
        # If not in admin collection, check if user has admin role in users collection
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
    users = list(users_collection.find())
    formatted_users = []
    for user in users:
        formatted_users.append({
            'id': str(user['_id']),
            'name': user.get('name'),
            'email': user.get('email'),
            'role': user.get('role'),
            'created_at': user.get('created_at'),
            'last_logged_in': user.get('last_logged_in'),
            'api_calls_remaining': user.get('api_calls_remaining'),
            'max_api_calls': user.get('max_api_calls'),
            'subscription_enabled': user.get('subscription_enabled'),
        })
    # Also include admins from admin_register collection
    admins = list(admin_register_collection.find())
    for admin in admins:
        formatted_users.append({
            'id': str(admin['_id']),
            'name': admin.get('name'),
            'email': admin.get('email'),
            'role': 'admin',
            'created_at': admin.get('created_at'),
            'last_logged_in': admin.get('last_logged_in'),
            'api_calls_remaining': None,
            'max_api_calls': None,
            'subscription_enabled': None,
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

# Helper functions
def is_valid_email(email):
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None

def is_valid_password(password):
    # At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    if len(password) < 8:
        return False
    if not any(c.isupper() for c in password):
        return False
    if not any(c.islower() for c in password):
        return False
    if not any(c.isdigit() for c in password):
        return False
    return True

# Admin registration
@admin_bp.route('/register', methods=['POST'])
def admin_register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'password', 'secretKey']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Extract data
    name = data['name']
    email = data['email'].lower()
    password = data['password']
    secret_key = data['secretKey']
    
    # Validate secret key
    if secret_key != 'parth@123':
        return jsonify({'error': 'Invalid administrator secret key'}), 403
    
    # Validate email format
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password
    if not is_valid_password(password):
        return jsonify({'error': 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers'}), 400
    
    # Check if admin already exists
    if admin_register_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already registered as admin'}), 400
    
    # Hash password
    from flask_bcrypt import Bcrypt
    bcrypt = Bcrypt(current_app)
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Create admin document
    admin = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'created_at': datetime.now()
    }
    
    # Insert admin into database
    result = admin_register_collection.insert_one(admin)
    
    # Create access token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        'message': 'Admin registered successfully',
        'token': access_token,
        'user': {
            'id': str(result.inserted_id),
            'name': name,
            'email': email,
            'role': 'admin'
        }
    }), 201

# Admin login
@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    
    # Validate required fields
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Extract data
    email = data['email'].lower()
    password = data['password']
    
    # Find admin by email
    admin = admin_register_collection.find_one({'email': email})
    if not admin:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Verify password
    from flask_bcrypt import Bcrypt
    bcrypt = Bcrypt(current_app)
    if not bcrypt.check_password_hash(admin['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create access token
    access_token = create_access_token(identity=str(admin['_id']))
    
    # Update login timestamp
    admin_register_collection.update_one(
        {'_id': admin['_id']},
        {'$set': {'last_logged_in': datetime.now()}}
    )
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': {
            'id': str(admin['_id']),
            'name': admin['name'],
            'email': admin['email'],
            'role': 'admin'
        }
    }), 200

# Ensure the subscription toggle document exists with default state
def ensure_subscription_toggle_exists():
    # Check if the document exists
    toggle_doc = subscription_enable_collection.find_one({"_id": "global_toggle"})
    
    # If not, create it with default value (True)
    if not toggle_doc:
        subscription_enable_collection.insert_one({
            "_id": "global_toggle",
            "want_subscription": True,
            "updated_at": datetime.now(),
            "updated_by": None
        })
        return True
    
    return toggle_doc.get("want_subscription", True)

# Call on module import to ensure the toggle exists
ensure_subscription_toggle_exists()

# Get subscription toggle state
@admin_bp.route('/subscription-toggle', methods=['GET'])
def get_subscription_toggle():
    # Get the toggle state
    toggle_doc = subscription_enable_collection.find_one({"_id": "global_toggle"})
    
    if not toggle_doc:
        # Create it if it doesn't exist and return default
        want_subscription = ensure_subscription_toggle_exists()
    else:
        want_subscription = toggle_doc.get("want_subscription", True)
    
    return jsonify({
        "want_subscription": want_subscription
    }), 200

# Update subscription toggle (admin only)
@admin_bp.route('/subscription-toggle', methods=['PUT'])
@admin_required
def update_subscription_toggle():
    data = request.get_json()
    if 'want_subscription' not in data:
        return jsonify({'error': 'want_subscription field is required'}), 400
    want_subscription = data['want_subscription']
    if not isinstance(want_subscription, bool):
        return jsonify({'error': 'want_subscription must be a boolean value'}), 400
    user_id = get_jwt_identity()
    subscription_enable_collection.update_one(
        {"_id": "global_toggle"},
        {
            "$set": {
                "want_subscription": want_subscription,
                "updated_at": datetime.now(),
                "updated_by": user_id
            }
        },
        upsert=True
    )
    return jsonify({
        "message": f"Subscription features {'enabled' if want_subscription else 'disabled'} successfully",
        "want_subscription": want_subscription
    }), 200

# Analytics endpoint for admin dashboard
@admin_bp.route('/analytics', methods=['GET'])
@admin_required
def admin_analytics():
    # Basic stats
    total_users = users_collection.count_documents({})
    total_admins = users_collection.count_documents({'role': 'admin'}) + admin_register_collection.count_documents({})
    api_calls_remaining = sum(u.get('api_calls_remaining', 0) for u in users_collection.find())
    api_calls_used = sum((u.get('max_api_calls', 0) - u.get('api_calls_remaining', 0)) for u in users_collection.find())

    # Full user and admin lists
    users = list(users_collection.find())
    admins = list(admin_register_collection.find())
    user_list = [{
        'id': str(u['_id']),
        'name': u.get('name'),
        'email': u.get('email'),
        'role': u.get('role'),
        'created_at': u.get('created_at'),
        'last_logged_in': u.get('last_logged_in'),
        'api_calls_remaining': u.get('api_calls_remaining'),
        'max_api_calls': u.get('max_api_calls'),
        'subscription_enabled': u.get('subscription_enabled'),
    } for u in users]
    admin_list = [{
        'id': str(a['_id']),
        'name': a.get('name'),
        'email': a.get('email'),
        'role': 'admin',
        'created_at': a.get('created_at'),
        'last_logged_in': a.get('last_logged_in'),
    } for a in admins]

    from datetime import datetime
    import dateutil.parser
    def parse_dt(val):
        if not val:
            return datetime.min
        if isinstance(val, datetime):
            return val
        try:
            return dateutil.parser.parse(val)
        except Exception:
            return datetime.min

    # Recent registrations (last 5 users by created_at)
    recent_registrations = sorted(
        users,
        key=lambda x: parse_dt(x.get('created_at')),
        reverse=True
    )[:5]
    recent_registrations = [{
        'id': str(u['_id']),
        'name': u.get('name', ''),
        'email': u.get('email', ''),
        'created_at': u.get('created_at'),
        'role': u.get('role', '')
    } for u in recent_registrations]

    # Recent logins (last 5 users/admins by last_logged_in)
    all_logins = users + admins
    recent_logins = sorted(
        all_logins,
        key=lambda x: parse_dt(x.get('last_logged_in')),
        reverse=True
    )[:5]
    recent_logins = [{
        'id': str(u['_id']),
        'name': u.get('name', ''),
        'email': u.get('email', ''),
        'last_logged_in': u.get('last_logged_in'),
        'role': u.get('role', 'admin')
    } for u in recent_logins]

    # API usage breakdown per user
    api_usage = [{
        'id': str(u['_id']),
        'name': u.get('name', ''),
        'email': u.get('email', ''),
        'api_calls_remaining': u.get('api_calls_remaining'),
        'max_api_calls': u.get('max_api_calls'),
        'api_calls_used': (u.get('max_api_calls', 0) - u.get('api_calls_remaining', 0)) if u.get('max_api_calls') is not None and u.get('api_calls_remaining') is not None else None
    } for u in users]

    return jsonify({
        'total_users': total_users,
        'total_admins': total_admins,
        'api_calls_remaining': api_calls_remaining,
        'api_calls_used': api_calls_used,
        'users': user_list,
        'admins': admin_list,
        'recent_registrations': recent_registrations,
        'recent_logins': recent_logins,
        'api_usage': api_usage
    }), 200
    # Get request data
    data = request.get_json()
    
    if 'want_subscription' not in data:
        return jsonify({'error': 'want_subscription field is required'}), 400
    
    want_subscription = data['want_subscription']
    
    if not isinstance(want_subscription, bool):
        return jsonify({'error': 'want_subscription must be a boolean value'}), 400
    
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Update the toggle
    subscription_enable_collection.update_one(
        {"_id": "global_toggle"},
        {
            "$set": {
                "want_subscription": want_subscription,
                "updated_at": datetime.now(),
                "updated_by": user_id
            }
        },
        upsert=True
    )
    
    return jsonify({
        "message": f"Subscription features {'enabled' if want_subscription else 'disabled'} successfully",
        "want_subscription": want_subscription
    }), 200
