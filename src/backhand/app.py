from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import timedelta, datetime
import re
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email_templates import get_password_reset_template, get_password_reset_success_template

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'meri_shiksha_secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database('meri_shiksha')
users_collection = db.users
verification_codes_collection = db.verification_codes

# Email configuration
EMAIL_ADDRESS = os.environ.get('EMAIL_ADDRESS', 'merishiksha.noreply@gmail.com')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', 'your-app-password')
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))

# Email validation function
def is_valid_email(email):
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None

# Password validation function
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

# Import routes
from User.routes import user_bp
from Admin.routes import admin_bp

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Authentication routes
@app.route('/api/register', methods=['POST'])
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
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Create user document
    user = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'role': role,
        'created_at': datetime.now()
    }
    
    # Insert user into database
    result = users_collection.insert_one(user)

    # Send welcome email
    try:
        from email_templates import get_welcome_email_template
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

@app.route('/api/login', methods=['POST'])
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
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Update login tracking fields
    now = datetime.now()
    update_fields = {}
    if 'first_logged_in' not in user or not user.get('first_logged_in'):
        update_fields['first_logged_in'] = now
    update_fields['last_logged_in'] = now
    update_fields['login_count'] = user.get('login_count', 0) + 1
    users_collection.update_one({'_id': user['_id']}, {'$set': update_fields})
    
    # Create access token
    access_token = create_access_token(identity=str(user['_id']))
    
    # Return updated user info
    user = users_collection.find_one({'email': email})
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'first_logged_in': user.get('first_logged_in'),
            'last_logged_in': user.get('last_logged_in'),
            'login_count': user.get('login_count', 1)
        }
    }), 200

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Find user by ID
    from bson.objectid import ObjectId
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Return user data (excluding password)
    return jsonify({
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'role': user['role']
    }), 200

# Send email function
def send_email(to_email, subject, html_content):
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # GoDaddy uses SSL not STARTTLS
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# Generate verification code
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

# Forgot password route
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    email = data['email'].lower()
    
    # Find user by email
    user = users_collection.find_one({'email': email})
    
    if not user:
        # Don't reveal that the email doesn't exist for security reasons
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
    email_template = get_password_reset_template(verification_code)
    email_sent = send_email(
        email,
        'MeriShiksha Password Reset',
        email_template
    )
    
    if not email_sent:
        return jsonify({'error': 'Failed to send verification code. Please try again later.'}), 500
    
    return jsonify({'message': 'If your email is registered, you will receive a password reset code'}), 200

# Verify code route
@app.route('/api/verify-reset-code', methods=['POST'])
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

# Reset password route
@app.route('/api/reset-password', methods=['POST'])
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
        from flask_jwt_extended import decode_token
        decoded = decode_token(reset_token)
        email = decoded['sub']
        
        # Find user by email
        user = users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Hash new password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        
        # Update user's password
        users_collection.update_one(
            {'email': email},
            {'$set': {'password': hashed_password}}
        )
        
        # Delete all verification codes for this email
        verification_codes_collection.delete_many({'email': email})
        
        # Send success email
        email_template = get_password_reset_success_template(user['name'])
        send_email(
            email,
            'MeriShiksha Password Reset Successful',
            email_template
        )
        
        return jsonify({'message': 'Password has been reset successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': 'Invalid or expired reset token'}), 400

# Root route
@app.route('/')
def index():
    return jsonify({'message': 'MeriShiksha API is running'})

if __name__ == '__main__':
    app.run(debug=True)
