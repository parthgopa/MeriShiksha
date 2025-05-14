import sys
import os

# Add src/backhand to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'src', 'backhand')))

from src.backhand.app import app

with app.app_context():
    for rule in app.url_map.iter_rules():
        methods = ', '.join(sorted(rule.methods))
        print(f"{rule.endpoint}: {rule} ({methods})")

# C:\Users\PARTH GOPANI\anaconda3\Lib\site-packages\pymongo\pyopenssl_context.py:352: CryptographyDeprecationWarning: Parsed a negative serial number, which is disallowed by RFC 5280. Loading this certificate will cause an exception in the next release of cryptography.
#   _crypto.X509.from_cryptography(x509.load_der_x509_certificate(cert))
# static: /static/<path:filename> (GET, HEAD, OPTIONS)
# user.contact_support: /api/user/contact-support (OPTIONS, POST)
# user.get_profile: /api/user/profile (GET, HEAD, OPTIONS)
# user.update_profile: /api/user/profile (OPTIONS, PUT)
# user.register: /api/user/register (OPTIONS, POST)
# user.login: /api/user/login (OPTIONS, POST)
# user.forgot_password: /api/user/forgot-password (OPTIONS, POST)
# user.verify_reset_code: /api/user/verify-reset-code (OPTIONS, POST)
# user.reset_password: /api/user/reset-password (OPTIONS, POST)
# user.decrement_api_calls: /api/user/decrement-api-calls (OPTIONS, POST)
# user.update_subscription: /api/user/update-subscription (OPTIONS, POST)
# user.change_password: /api/user/change-password (OPTIONS, PUT)
# user.set_admin_role: /api/user/set-admin-role (OPTIONS, POST)
# admin.get_users: /api/admin/users (GET, HEAD, OPTIONS)
# admin.get_user: /api/admin/users/<user_id> (GET, HEAD, OPTIONS)
# admin.update_user: /api/admin/users/<user_id> (OPTIONS, PUT)
# admin.delete_user: /api/admin/users/<user_id> (DELETE, OPTIONS)
# admin.admin_register: /api/admin/register (OPTIONS, POST)
# admin.admin_login: /api/admin/login (OPTIONS, POST)
# admin.get_subscription_toggle: /api/admin/subscription-toggle (GET, HEAD, OPTIONS)
# admin.update_subscription_toggle: /api/admin/subscription-toggle (OPTIONS, PUT)
# admin.admin_analytics: /api/admin/analytics (GET, HEAD, OPTIONS)
# marketing.send_campaign: /api/marketing/send-campaign (OPTIONS, POST)
# marketing.get_campaigns: /api/marketing/campaigns (GET, HEAD, OPTIONS)
# marketing.create_campaign: /api/marketing/campaigns (OPTIONS, POST)
# marketing.get_campaign: /api/marketing/campaigns/<campaign_id> (GET, HEAD, OPTIONS)
# marketing.update_campaign: /api/marketing/campaigns/<campaign_id> (OPTIONS, PUT)
# marketing.delete_campaign: /api/marketing/campaigns/<campaign_id> (DELETE, OPTIONS)
# marketing.get_templates: /api/marketing/templates (GET, HEAD, OPTIONS)
# marketing.create_template: /api/marketing/templates (OPTIONS, POST)
# marketing.update_template: /api/marketing/templates/<template_id> (OPTIONS, PUT)
# marketing.delete_template: /api/marketing/templates/<template_id> (DELETE, OPTIONS)
# index: / (GET, HEAD, OPTIONS)        