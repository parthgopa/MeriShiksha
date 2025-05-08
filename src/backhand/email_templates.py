"""
Email templates for MeriShiksha application
"""

def get_contact_message_template(name, email, message):
    """
    Returns HTML email template for contact form submissions
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>New Contact Message - MeriShiksha</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f9f9f9;
                margin: 0;
                padding: 0;
                color: #222;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(20,184,166,0.12), 0 1.5px 6px rgba(110,142,251,0.08);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(90deg, #14b8a6 0%, #6e8efb 100%);
                color: #fff;
                text-align: center;
                padding: 40px 20px 20px 20px;
            }}
            .header h1 {{
                margin: 0;
                font-size: 2.2rem;
                font-weight: bold;
                letter-spacing: 2px;
            }}
            .content {{
                padding: 32px 30px 30px 30px;
            }}
            .info-label {{
                font-weight: bold;
                color: #14b8a6;
            }}
            .footer {{
                text-align: center;
                font-size: 13px;
                color: #888;
                border-top: 1px solid #eee;
                padding: 20px 0 10px 0;
                background: #f9f9f9;
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Contact Message</h1>
            </div>
            <div class='content'>
                <p><span class='info-label'>Name:</span> {name}</p>
                <p><span class='info-label'>Email:</span> {email}</p>
                <p><span class='info-label'>Message:</span></p>
                <div style='background:#f1f5f9; border-radius:8px; padding:16px; margin-top:6px; color:#333;'>{message}</div>
            </div>
            <div class='footer'>
                &copy; 2025 MeriShiksha. All rights reserved.<br>
                This is an automated message from the contact form.
            </div>
        </div>
    </body>
    </html>
    """


def get_welcome_email_template(user_name):
    """
    Returns HTML email template for welcoming a new user
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Welcome to MeriShiksha!</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #14b8a6 0%, #6e8efb 100%);
                margin: 0;
                padding: 0;
                color: #222;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(20,184,166,0.12), 0 1.5px 6px rgba(110,142,251,0.08);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(90deg, #14b8a6 0%, #6e8efb 100%);
                color: #fff;
                text-align: center;
                padding: 40px 20px 20px 20px;
            }}
            .header h1 {{
                margin: 0;
                font-size: 2.5rem;
                font-weight: bold;
                letter-spacing: 2px;
            }}
            .header span {{
                color: #fff176;
            }}
            .content {{
                padding: 40px 30px 30px 30px;
                text-align: center;
            }}
            .welcome-icon {{
                font-size: 60px;
                color: #14b8a6;
                margin-bottom: 20px;
            }}
            .cta-btn {{
                display: inline-block;
                margin-top: 30px;
                padding: 14px 36px;
                background: linear-gradient(90deg, #6e8efb 0%, #14b8a6 100%);
                color: #fff;
                border-radius: 6px;
                font-size: 1.1rem;
                font-weight: bold;
                text-decoration: none;
                letter-spacing: 1px;
                box-shadow: 0 2px 8px rgba(20,184,166,0.08);
                transition: background 0.3s;
            }}
            .cta-btn:hover {{
                background: linear-gradient(90deg, #14b8a6 0%, #6e8efb 100%);
            }}
            .footer {{
                text-align: center;
                font-size: 13px;
                color: #888;
                border-top: 1px solid #eee;
                padding: 20px 0 10px 0;
                background: #f9f9f9;
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1><span style='color:#fff176;'>Meri</span>Shiksha</h1>
            </div>
            <div class='content'>
                <div class='welcome-icon'>🎉</div>
                <h2>Welcome, {user_name}!</h2>
                <p style='font-size:1.15rem; margin: 18px 0 28px 0;'>
                    We’re thrilled to have you join the <b>MeriShiksha</b> family.<br>
                    Your learning journey just got a lot more exciting!
                </p>
                <p style='color:#555;'>
                    Explore interactive lessons, personalized recommendations, and a vibrant community of learners.<br>
                    If you have any questions or need help, our team is just an email away.
                </p>
                <a href="https://merishiksha.com" class="cta-btn">Start Learning Now</a>
            </div>
            <div class='footer'>
                &copy; {2025} MeriShiksha. All rights reserved. <br>
                This is an automated message, please do not reply.
            </div>
        </div>
    </body>
    </html>
    """

def get_password_reset_template(verification_code):
    """
    Returns HTML email template for password reset with verification code
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - MeriShiksha</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #eee;
            }}
            .logo {{
                max-width: 150px;
                height: auto;
            }}
            .content {{
                padding: 30px 20px;
                text-align: center;
            }}
            .verification-code {{
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                margin: 30px 0;
                padding: 15px;
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                border-radius: 8px;
                display: inline-block;
            }}
            .message {{
                margin-bottom: 30px;
                font-size: 16px;
                color: #555;
            }}
            .footer {{
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #999;
                font-size: 12px;
            }}
            .note {{
                font-size: 14px;
                color: #777;
                margin-top: 20px;
                font-style: italic;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="color: #6e8efb;"><span style="color: #14b8a6;">Meri</span>Shiksha</h1>
            </div>
            <div class="content">
                <h2>Password Reset</h2>
                <p class="message">We received a request to reset your password. Please use the verification code below to complete the process:</p>
                <div class="verification-code">{verification_code}</div>
                <p>This code will expire in 10 minutes for security reasons.</p>
                <p class="note">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
                <p>&copy; {2025} MeriShiksha. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """

def get_password_reset_success_template(user_name):
    """
    Returns HTML email template for successful password reset
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful - MeriShiksha</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #eee;
            }}
            .logo {{
                max-width: 150px;
                height: auto;
            }}
            .content {{
                padding: 30px 20px;
                text-align: center;
            }}
            .success-icon {{
                font-size: 48px;
                color: #14b8a6;
                margin-bottom: 20px;
            }}
            .message {{
                margin-bottom: 30px;
                font-size: 16px;
                color: #555;
            }}
            .footer {{
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #999;
                font-size: 12px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="color: #6e8efb;"><span style="color: #14b8a6;">Meri</span>Shiksha</h1>
            </div>
            <div class="content">
                <div class="success-icon">✓</div>
                <h2>Password Reset Successful</h2>
                <p class="message">Hi {user_name},<br>Your password has been successfully reset. You can now log in to your account with your new password.</p>
                <a href="https://merishiksha.com" class="button">Go to Login</a>
                <p style="margin-top: 30px;">If you did not reset your password, please contact our support team immediately.</p>
            </div>
            <div class="footer">
                <p>&copy; {2025} MeriShiksha. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
