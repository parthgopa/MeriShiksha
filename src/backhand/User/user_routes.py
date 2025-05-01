from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, decode_token
from bson.objectid import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import re
import random
import string
import hashlib
import json
from urllib.parse import urlencode

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database('meri_shiksha')
users_collection = db.users
verification_codes_collection = db.verification_codes
subscriptions_collection = db.subscriptions

# Paytm Configuration
PAYTM_MERCHANT_ID = os.environ.get('PAYTM_MERCHANT_ID')
PAYTM_MERCHANT_KEY = os.environ.get('PAYTM_MERCHANT_KEY')
PAYTM_MERCHANT_WEBSITE = os.environ.get('PAYTM_MERCHANT_WEBSITE')
PAYTM_CHANNEL_ID = os.environ.get('PAYTM_CHANNEL_ID', 'WEB')
PAYTM_INDUSTRY_TYPE_ID = os.environ.get('PAYTM_INDUSTRY_TYPE_ID', 'Retail')
PAYTM_CALLBACK_URL = os.environ.get('PAYTM_CALLBACK_URL', 'http://localhost:5000/api/user/paytm-callback')

# Paytm URLs
PAYTM_TXN_URL = 'https://securegw-stage.paytm.in/theia/processTransaction'  # For Sandbox
# PAYTM_TXN_URL = 'https://securegw.paytm.in/theia/processTransaction'  # For Production

# Generate checksum for Paytm
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64

def generate_checksum(param_dict, merchant_key):
    params_string = "&".join([f"{key}={param_dict[key]}" for key in sorted(param_dict.keys())])
    checksum_string = params_string + "|" + merchant_key
    return hashlib.sha256(checksum_string.encode()).hexdigest()

def verify_checksum(param_dict, merchant_key, checksum):
    params_string = "&".join([f"{key}={param_dict[key]}" for key in sorted(param_dict.keys())])
    checksum_string = params_string + "|" + merchant_key
    return hashlib.sha256(checksum_string.encode()).hexdigest() == checksum

# Create blueprint
user_bp = Blueprint('user', __name__)

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

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

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
        'created_at': user.get('created_at'),
        'max_api_calls': user.get('max_api_calls', 50),
        'subscription_end_date': user.get('subscription_end_date')
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
        'created_at': updated_user.get('created_at'),
        'max_api_calls': updated_user.get('max_api_calls', 50),
        'subscription_end_date': updated_user.get('subscription_end_date')
    }), 200


# User registration
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Extract data
    name = data['name']
    email = data['email'].lower()
    password = data['password']
    role = data['role']
    
    # Validate email format
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password
    if not is_valid_password(password):
        return jsonify({'error': 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers'}), 400
    
    # Check if user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 400
    
    # Hash password
    from flask_bcrypt import Bcrypt
    bcrypt = Bcrypt(current_app)
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Create user document
    user = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'role': role,
        'created_at': datetime.now(),
        'max_api_calls': 50,  # Initialize with 50 free API calls
        'api_calls_remaining': 50  # Initialize remaining calls
    }
    
    # Insert user into database
    result = users_collection.insert_one(user)

    # Send welcome email
    try:
        from email_templates import get_welcome_email_template
        from app import send_email
        welcome_html = get_welcome_email_template(name)
        send_email(email, 'Welcome to MeriShiksha!', welcome_html)
    except Exception as e:
        print(f"Error sending welcome email: {e}")
    
    # Create access token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'user': {
            'id': str(result.inserted_id),
            'name': name,
            'email': email,
            'role': role
        }
    }), 201


# User login
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Extract data
    email = data['email'].lower()
    password = data['password']
    
    # Find user by email
    user = users_collection.find_one({'email': email})
    
    # Check if user exists and password is correct
    from flask_bcrypt import Bcrypt
    bcrypt = Bcrypt(current_app)
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Update login info
    now = datetime.now().isoformat()
    update_fields = {}
    if not user.get('first_logged_in'):
        update_fields['first_logged_in'] = now
    update_fields['last_logged_in'] = now
    
    # Ensure api_calls_remaining is initialized if not present
    if 'api_calls_remaining' not in user:
        update_fields['api_calls_remaining'] = user.get('max_api_calls', 50)
        
    # Update the user document with both set and increment operations
    users_collection.update_one(
        {'_id': user['_id']}, 
        {
            '$set': update_fields, 
            '$inc': {'login_count': 1}
        }
    )
    
    # Create access token
    access_token = create_access_token(identity=str(user['_id']))
    
    # Get updated user data
    user = users_collection.find_one({'_id': user['_id']})
    
    # Get subscription status and API calls
    max_api_calls = user.get('max_api_calls', 50)
    api_calls_remaining = user.get('api_calls_remaining', max_api_calls)
    
    # Check if user has an active subscription
    has_subscription = False
    if max_api_calls == -1:
        has_subscription = True  # Unlimited calls means premium subscription
    elif user.get('subscription_end_date'):
        # Check if subscription is still valid
        if datetime.now() < datetime.fromisoformat(user['subscription_end_date']):
            has_subscription = True
    
    # Make sure api_calls_remaining is initialized
    if api_calls_remaining is None:
        api_calls_remaining = max_api_calls
        # Update user with correct api_calls_remaining
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'api_calls_remaining': api_calls_remaining}}
        )
    
    # Log the user data being returned
    print(f"User login - ID: {user['_id']}, API calls: {api_calls_remaining}/{max_api_calls}")
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': str(user['_id']),
            'name': user.get('name'),
            'email': user.get('email'),
            'role': user.get('role'),
            'max_api_calls': max_api_calls,
            'api_calls_remaining': api_calls_remaining,
            'has_subscription': has_subscription
        }
    }), 200


# Forgot password
@user_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    email = data['email'].lower()
    
    # Check if user exists
    user = users_collection.find_one({'email': email})
    
    # For security reasons, don't reveal if email exists or not
    if not user:
        return jsonify({'message': 'If your email is registered, you will receive a password reset code'}), 200
    
    # Generate verification code
    verification_code = generate_verification_code()
    
    # Store verification code in database with expiration time (10 minutes)
    expiration_time = datetime.now() + timedelta(minutes=10)
    
    verification_data = {
        'email': email,
        'code': verification_code,
        'expires_at': expiration_time
    }
    
    # Remove any existing verification codes for this email
    verification_codes_collection.delete_many({'email': email})
    
    # Insert new verification code
    verification_codes_collection.insert_one(verification_data)
    
    # Send email with verification code
    from email_templates import get_password_reset_template
    from app import send_email
    email_template = get_password_reset_template(verification_code)
    email_sent = send_email(
        email,
        'MeriShiksha Password Reset',
        email_template
    )
    
    if not email_sent:
        return jsonify({'error': 'Failed to send verification code. Please try again later.'}), 500
    
    return jsonify({'message': 'If your email is registered, you will receive a password reset code'}), 200


# Verify reset code
@user_bp.route('/verify-reset-code', methods=['POST'])
def verify_reset_code():
    data = request.get_json()
    
    if 'email' not in data or 'code' not in data:
        return jsonify({'error': 'Email and verification code are required'}), 400
    
    email = data['email'].lower()
    code = data['code']
    
    # Find verification code in database
    verification = verification_codes_collection.find_one({
        'email': email,
        'code': code,
        'expires_at': {'$gt': datetime.now()}
    })
    
    if not verification:
        return jsonify({'error': 'Invalid or expired verification code'}), 400
    
    # Generate a temporary token for resetting password
    reset_token = create_access_token(
        identity=email,
        expires_delta=timedelta(minutes=10)
    )
    
    return jsonify({
        'message': 'Verification successful',
        'reset_token': reset_token
    }), 200


# Reset password
@user_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if 'reset_token' not in data or 'new_password' not in data:
        return jsonify({'error': 'Reset token and new password are required'}), 400
    
    reset_token = data['reset_token']
    new_password = data['new_password']
    
    # Validate password
    if not is_valid_password(new_password):
        return jsonify({'error': 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers'}), 400
    
    try:
        # Decode token to get email
        decoded = decode_token(reset_token)
        email = decoded['sub']
        
        # Find user by email
        user = users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Hash new password
        from flask_bcrypt import Bcrypt
        bcrypt = Bcrypt(current_app)
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        
        # Update user's password
        users_collection.update_one(
            {'email': email},
            {'$set': {'password': hashed_password}}
        )
        
        # Delete all verification codes for this email
        verification_codes_collection.delete_many({'email': email})
        
        # Send success email
        from email_templates import get_password_reset_success_template
        from app import send_email
        email_template = get_password_reset_success_template(user['name'])
        send_email(
            email,
            'MeriShiksha Password Reset Successful',
            email_template
        )
        
        return jsonify({'message': 'Password has been reset successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': 'Invalid or expired reset token'}), 400


# Decrement API calls
@user_bp.route('/decrement-api-calls', methods=['POST'])
@jwt_required()
def decrement_api_calls():
    user_id = get_jwt_identity()
    
    # Add a timestamp check to prevent rapid consecutive API calls
    # This prevents the same user from making multiple API calls within a short time frame
    current_time = datetime.now()
    last_api_call = users_collection.find_one({
        '_id': ObjectId(user_id),
        'last_api_call_time': {'$exists': True}
    })
    
    if last_api_call and 'last_api_call_time' in last_api_call:
        last_time = datetime.fromisoformat(last_api_call['last_api_call_time'])
        time_diff = (current_time - last_time).total_seconds()
        
        # If less than 2 seconds since last API call, reject to prevent rapid decrements
        if time_diff < 2:
            print(f"Rate limiting API call for user {user_id} - too soon after last call ({time_diff} seconds)")
            return jsonify({
                'message': 'Please wait before making another request',
                'rate_limited': True
            }), 429
    
    # Update the last API call time
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'last_api_call_time': current_time.isoformat()}}
    )
    
    # Get the user data
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check if user has a subscription
    subscription_end_date = user.get('subscription_end_date')
    if subscription_end_date:
        # Check if subscription is still valid
        if datetime.now() < datetime.fromisoformat(subscription_end_date):
            # User has an active subscription, no need to decrement API calls
            return jsonify({
                'message': 'API call processed under subscription',
                'max_api_calls': user.get('max_api_calls', 50),
                'api_calls_remaining': user.get('max_api_calls', 50),  # Always return max since subscription is active
                'subscription_active': True,
                'subscription_end_date': subscription_end_date
            }), 200
    
    # If no subscription or expired subscription, decrement API calls
    max_api_calls = user.get('max_api_calls', 50)
    api_calls_remaining = user.get('api_calls_remaining')
    
    # Make sure api_calls_remaining is initialized
    if api_calls_remaining is None:
        api_calls_remaining = max_api_calls
        # Update user with correct api_calls_remaining
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'api_calls_remaining': api_calls_remaining}}
        )
    
    print(f"Checking API calls - User ID: {user_id}, API calls remaining: {api_calls_remaining}/{max_api_calls}")
    
    if api_calls_remaining <= 0:
        print(f"No API calls remaining for user {user_id}")
        return jsonify({
            'error': 'No API calls remaining',
            'max_api_calls': max_api_calls,
            'api_calls_remaining': 0,
            'subscription_active': False
        }), 403
    
    # Decrement API calls
    new_api_calls_remaining = api_calls_remaining - 1
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'api_calls_remaining': new_api_calls_remaining}}
    )
    
    print(f"API call decremented - User ID: {user_id}, New count: {new_api_calls_remaining}")
    
    # Get updated user data to return
    updated_user = users_collection.find_one({'_id': ObjectId(user_id)})
    
    return jsonify({
        'id': str(updated_user['_id']),
        'name': updated_user.get('name'),
        'email': updated_user.get('email'),
        'role': updated_user.get('role'),
        'max_api_calls': updated_user.get('max_api_calls', 50),
        'api_calls_remaining': new_api_calls_remaining,
        'message': 'API call processed',
        'subscription_active': False
    }), 200

# Update subscription
@user_bp.route('/update-subscription', methods=['POST'])
@jwt_required()
def update_subscription():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if 'plan' not in data:
        return jsonify({'error': 'Plan is required'}), 400
    
    plan = data['plan']
    
    # Get subscription details from database
    subscription = subscriptions_collection.find_one({'plan_id': plan})
    if not subscription:
        return jsonify({'error': 'Invalid subscription plan'}), 400
    
    # Calculate subscription end date
    duration_days = subscription.get('duration_days', 30)
    subscription_end_date = datetime.now() + timedelta(days=duration_days)
    
    # Update user subscription
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {
            'subscription_plan': plan,
            'subscription_end_date': subscription_end_date.isoformat(),
            'max_api_calls': subscription.get('max_api_calls', 50),
            'api_calls_remaining': subscription.get('max_api_calls', 50),
            'subscription_updated_at': datetime.now().isoformat()
        }}
    )
    
    # Get updated user data
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    
    return jsonify({
        'message': 'Subscription updated successfully',
        'subscription_plan': plan,
        'subscription_end_date': user.get('subscription_end_date'),
        'max_api_calls': user.get('max_api_calls', 50),
        'api_calls_remaining': user.get('api_calls_remaining', 50)
    }), 200

# Change password
@user_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    if not current_password or not new_password:
        return jsonify({'error': 'Both current and new password are required.'}), 400
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    # Verify current password
    from flask_bcrypt import Bcrypt
    bcrypt = Bcrypt(current_app)
    if not bcrypt.check_password_hash(user['password'], current_password):
        return jsonify({'error': 'Current password is incorrect.'}), 400
    # Validate new password
    if not is_valid_password(new_password):
        return jsonify({'error': 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers'}), 400
    # Update password
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'password': hashed_password}})
    return jsonify({'message': 'Password updated successfully.'}), 200
