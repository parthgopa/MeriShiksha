from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from pymongo import MongoClient
import os
from datetime import datetime
from functools import wraps

# Import admin middleware
from .routes import admin_required, db

# Initialize subscription toggle collection
subscription_enable_collection = db.subscription_enable

# Create blueprint
subscription_bp = Blueprint('subscription', __name__)

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
@subscription_bp.route('/subscription-toggle', methods=['GET'])
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
@subscription_bp.route('/subscription-toggle', methods=['PUT'])
@admin_required
def update_subscription_toggle():
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
