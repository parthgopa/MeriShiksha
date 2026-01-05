import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Gemini API configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
print("Gemini API Key : ", GEMINI_API_KEY)
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# Use different referer based on environment
REFERER = os.environ.get('APP_REFERER', 'https://merishiksha.ai4cs.in')

def call_gemini_api(question):
    """
    Make a request to Gemini API with the given question using direct HTTP requests
    
    Args:
        question (str): The question/prompt to send to Gemini
        
    Returns:
        dict: Response from Gemini API in the same format as expected by frontend
    """

    try:
        if not question:
            return {
                'candidates': [{
                    'content': {
                        'parts': [{
                            'text': 'Please provide a question to process.'
                        }]
                    }
                }]
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
            GEMINI_API_URL,
            json={
                'contents': [{'parts': [{'text': question}]}]
            },
            timeout=120,
            headers=headers
        )
        
        if response.status_code == 200 and response.json():
            return response.json()
        else:
            print(f"Invalid response from Gemini API: {response.status_code}")
            print(f"Response text: {response.text}")
            return {
                'candidates': [{
                    'content': {
                        'parts': [{
                            'text': f"API Error ({response.status_code}): Sorry, we couldn't generate a response. Please try again later."
                        }]
                    }
                }]
            }
            
    except requests.exceptions.Timeout:
        return {
            'candidates': [{
                'content': {
                    'parts': [{
                        'text': "The request timed out. This usually happens with complex requests. Please try again or simplify your request."
                    }]
                }
            }]
        }
    except requests.exceptions.RequestException as e:
        print(f"Error in Gemini API request: {e}")
        error_message = "An error occurred while processing your request. Please try again later."
        
        if hasattr(e, 'response') and e.response.status_code == 429:
            error_message = "API rate limit exceeded. Please wait a moment and try again."
        elif hasattr(e, 'response') and e.response.status_code == 403:
            error_message = "API key authentication failed. Your API key may have referer restrictions. Please check your Google Cloud Console settings."
            
        return {
            'candidates': [{
                'content': {
                    'parts': [{
                        'text': error_message
                    }]
                }
            }]
        }
    except Exception as e:
        print(f"Unexpected error in Gemini API: {e}")
        return {
            'candidates': [{
                'content': {
                    'parts': [{
                        'text': "An unexpected error occurred. Please try again later."
                    }]
                }
            }]
        }
