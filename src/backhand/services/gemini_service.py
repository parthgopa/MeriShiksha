import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Gemini API configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyCx9HnzaZy4yD6cUBMzcYQIY1Wl2vz8t8o')
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def call_gemini_api(question):
    """
    Make a request to Gemini API with the given question
    
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
        
        # Make request to Gemini API
        response = requests.post(
            GEMINI_API_URL,
            json={
                'contents': [{'parts': [{'text': question}]}]
            },
            timeout=120,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200 and response.json():
            return response.json()
        else:
            print(f"Invalid response from Gemini API: {response.status_code}")
            return {
                'candidates': [{
                    'content': {
                        'parts': [{
                            'text': "Sorry, we couldn't generate a response. Please try again later."
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
            error_message = "API key authentication failed. Please check your API configuration."
            
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
