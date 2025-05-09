from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from pymongo import MongoClient
import os
from datetime import datetime
from email_templates import get_marketing_email_template

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database('meri_shiksha')
users_collection = db.users
marketing_campaigns_collection = db.marketing_campaigns
marketing_templates_collection = db.marketing_templates

# Create blueprint
marketing_bp = Blueprint('marketing', __name__)

@marketing_bp.route('/send-campaign', methods=['POST'])
@jwt_required()
def send_campaign():
    """
    Send a marketing campaign to users
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    campaign_id = data.get('campaign_id')
    
    if not campaign_id:
        return jsonify({'error': 'Campaign ID is required'}), 400
    
    # Get campaign details
    campaign = marketing_campaigns_collection.find_one({'_id': ObjectId(campaign_id)})
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    # Get template details
    template = marketing_templates_collection.find_one({'_id': ObjectId(campaign.get('template_id'))})
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # Get users based on filter criteria
    filter_criteria = campaign.get('filter_criteria', {})
    users_cursor = users_collection.find(filter_criteria)
    
    # Send emails to users
    from app import send_email
    
    success_count = 0
    fail_count = 0
    
    for user in users_cursor:
        try:
            # Personalize email content
            personalized_content = template.get('content', '')
            personalized_content = personalized_content.replace('{{name}}', user.get('name', ''))
            personalized_content = personalized_content.replace('{{email}}', user.get('email', ''))
            
            # Generate HTML email
            html_content = get_marketing_email_template(
                campaign.get('subject', ''),
                personalized_content,
                campaign.get('cta_text', 'Learn More'),
                campaign.get('cta_url', 'https://merishiksha.com')
            )
            
            # Send email
            sent = send_email(
                user.get('email'),
                campaign.get('subject', 'MeriShiksha Update'),
                html_content
            )
            
            if sent:
                success_count += 1
            else:
                fail_count += 1
                
        except Exception as e:
            print(f"Error sending email to {user.get('email')}: {e}")
            fail_count += 1
    
    # Update campaign stats
    marketing_campaigns_collection.update_one(
        {'_id': ObjectId(campaign_id)},
        {
            '$set': {
                'last_sent': datetime.now().isoformat(),
                'stats.total_sent': success_count + fail_count,
                'stats.successful': success_count,
                'stats.failed': fail_count
            },
            '$inc': {
                'send_count': 1
            }
        }
    )
    
    return jsonify({
        'message': 'Campaign sent successfully',
        'stats': {
            'total': success_count + fail_count,
            'successful': success_count,
            'failed': fail_count
        }
    }), 200

@marketing_bp.route('/campaigns', methods=['GET'])
@jwt_required()
def get_campaigns():
    """
    Get all marketing campaigns
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Get all campaigns
    campaigns = list(marketing_campaigns_collection.find())
    
    # Convert ObjectId to string
    for campaign in campaigns:
        campaign['_id'] = str(campaign['_id'])
        if 'template_id' in campaign:
            campaign['template_id'] = str(campaign['template_id'])
    
    return jsonify(campaigns), 200

@marketing_bp.route('/campaigns', methods=['POST'])
@jwt_required()
def create_campaign():
    """
    Create a new marketing campaign
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'subject', 'template_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Create campaign
    campaign = {
        'name': data.get('name'),
        'subject': data.get('subject'),
        'template_id': ObjectId(data.get('template_id')),
        'filter_criteria': data.get('filter_criteria', {}),
        'cta_text': data.get('cta_text', 'Learn More'),
        'cta_url': data.get('cta_url', 'https://merishiksha.com'),
        'created_at': datetime.now().isoformat(),
        'created_by': ObjectId(user_id),
        'stats': {
            'total_sent': 0,
            'successful': 0,
            'failed': 0
        },
        'send_count': 0
    }
    
    # Insert campaign
    result = marketing_campaigns_collection.insert_one(campaign)
    
    return jsonify({
        'message': 'Campaign created successfully',
        'campaign_id': str(result.inserted_id)
    }), 201

@marketing_bp.route('/campaigns/<campaign_id>', methods=['GET'])
@jwt_required()
def get_campaign(campaign_id):
    """
    Get a specific marketing campaign
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Get campaign
    campaign = marketing_campaigns_collection.find_one({'_id': ObjectId(campaign_id)})
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    # Convert ObjectId to string
    campaign['_id'] = str(campaign['_id'])
    if 'template_id' in campaign:
        campaign['template_id'] = str(campaign['template_id'])
    if 'created_by' in campaign:
        campaign['created_by'] = str(campaign['created_by'])
    
    return jsonify(campaign), 200

@marketing_bp.route('/campaigns/<campaign_id>', methods=['PUT'])
@jwt_required()
def update_campaign(campaign_id):
    """
    Update a marketing campaign
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Get campaign
    campaign = marketing_campaigns_collection.find_one({'_id': ObjectId(campaign_id)})
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    # Update fields
    update_data = {}
    allowed_fields = ['name', 'subject', 'filter_criteria', 'cta_text', 'cta_url']
    
    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]
    
    if 'template_id' in data:
        update_data['template_id'] = ObjectId(data['template_id'])
    
    # Update campaign
    marketing_campaigns_collection.update_one(
        {'_id': ObjectId(campaign_id)},
        {'$set': update_data}
    )
    
    return jsonify({
        'message': 'Campaign updated successfully'
    }), 200

@marketing_bp.route('/campaigns/<campaign_id>', methods=['DELETE'])
@jwt_required()
def delete_campaign(campaign_id):
    """
    Delete a marketing campaign
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Delete campaign
    result = marketing_campaigns_collection.delete_one({'_id': ObjectId(campaign_id)})
    
    if result.deleted_count == 0:
        return jsonify({'error': 'Campaign not found'}), 404
    
    return jsonify({
        'message': 'Campaign deleted successfully'
    }), 200

@marketing_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_templates():
    """
    Get all marketing templates
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Get all templates
    templates = list(marketing_templates_collection.find())
    
    # Convert ObjectId to string
    for template in templates:
        template['_id'] = str(template['_id'])
        if 'created_by' in template:
            template['created_by'] = str(template['created_by'])
    
    return jsonify(templates), 200

@marketing_bp.route('/templates', methods=['POST'])
@jwt_required()
def create_template():
    """
    Create a new marketing template
    """
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Check if user is admin
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user or user.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'content']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Create template
    template = {
        'name': data.get('name'),
        'content': data.get('content'),
        'description': data.get('description', ''),
        'created_at': datetime.now().isoformat(),
        'created_by': ObjectId(user_id)
    }
    
    # Insert template
    result = marketing_templates_collection.insert_one(template)
    
    return jsonify({
        'message': 'Template created successfully',
        'template_id': str(result.inserted_id)
    }), 201
