from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Create Blueprint for API routes
api_bp = Blueprint('api', __name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini API KEY :", GEMINI_API_KEY)

# Use different referer based on environment
REFERER = os.environ.get('APP_REFERER', 'https://merishiksha.ai4cs.in')

@api_bp.route("/gemini", methods=["POST"])
def gemini():
    try:
        data = request.get_json()
        question = data.get("question")

        if not question:
            return jsonify({"error": "Question is required"}), 400

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

        payload = {
            "contents": [
                {
                    "parts": [{"text": question}]
                }
            ],
            "generationConfig": {
                "maxOutputTokens": 2048,
                "temperature": 0.7
            }
        }

        # Make request to Gemini API with proper headers to avoid 403 error
        headers = {
            'Content-Type': 'application/json',
            'Referer': REFERER,  # Use configurable referer
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=120
        )

        print(response)

        if response.status_code != 200:
            return jsonify({
                "error": "Gemini API failed",
                "details": response.text
            }), response.status_code

        return jsonify(response.json())

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out"}), 504

    except requests.exceptions.RequestException as e:
        print(f"Error in Gemini API request: {e}")
        error_message = "An error occurred while processing your request. Please try again later."
        
        if hasattr(e, 'response') and e.response.status_code == 429:
            error_message = "API rate limit exceeded. Please wait a moment and try again."
        elif hasattr(e, 'response') and e.response.status_code == 403:
            error_message = "API key authentication failed. Your API key may have referer restrictions. Please check your Google Cloud Console settings."
            
        return jsonify({"error": error_message}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
