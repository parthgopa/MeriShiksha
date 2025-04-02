from json import dumps
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from flask import make_response
from pymongo import MongoClient
app = Flask(__name__) 

@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "https://merishiksha.com"
    response.headers["Access-Control-Allow-Methods"] = "POST"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

CORS(app, resources={r"/submit-review": { "origins": "http://localhost:5173"  #THIS LINK IS FROM WHERE THE REQUEST IS COMING AND iT SHOULD BE NOT BLOCKED . SO WROTE INSIDE CORS().
}})

# ["https://merishiksha.com", "http://localhost:5173"]

# Path to the reviews file
REVIEWS_FILE = "reviews.txt"
client = MongoClient('mongodb://localhost:27017/') # Use your MongoDB connection string 
db = client['Parth_AI'] # Replace with your database name


visits = db["visits"]

@app.route('/submit-review', methods=['POST'])
def submit_review():
    data = request.get_json()
    review = data.get('review', '').strip()

    if not review:
        return jsonify({"message": "Review content is required"}), 400

    # Format the review with date and time
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    formatted_review = f"{current_time} - {review}\n"
    print(formatted_review)

    # Save the review to the file
    try:
        with open(REVIEWS_FILE, 'a') as file:
            file.write(formatted_review)
        return jsonify({"message": "Review saved successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to save review: {str(e)}"}), 500

@app.route('/get-reviews', methods=['GET'])
def get_reviews():
    try:
        with open(REVIEWS_FILE, 'r') as file:
            reviews = file.readlines()
        return jsonify({"reviews": reviews}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to retrieve reviews: {str(e)}"}), 500


@app.route('/get-visit-count', methods=['GET'])
def get_visit_count():
    visit_count = visits.find_one({"_id": "visit_count"})
    if visit_count is None:
        visit_count = {"_id": "visit_count", "count": 0}
        visits.insert_one(visit_count)
    return dumps(visit_count)

@app.route('/increase-visit-count', methods=['POST'])
def increase_visit_count():
    visits.update_one({"_id": "visit_count"}, {"$inc": {"count": 1}}, upsert=True)
    visit_count = visits.find_one({"_id": "visit_count"})
    return dumps(visit_count)

if __name__ == '__main__':
    # Ensure the reviews file exists
    if not os.path.exists(REVIEWS_FILE):
        open(REVIEWS_FILE, 'w').close()

    app.run(host='0.0.0.0', port=5000, debug=True)



# CORS (Cross-Origin Resource Sharing) :: is a security mechanism implemented by web browsers to prevent a web page from making requests to a different domain than the one that served the1 page
