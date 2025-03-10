<<<<<<< HEAD
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
=======
import random
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Parth_AI"
mongo = PyMongo(app)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/data', methods=['POST'])
def add_data():
    new_data = request.json
    #print(f"Received data: {new_data}")
    try:
        mongo.db.topic_learning.insert_one(new_data)
        return jsonify(message="Data added"), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(message=f"An error occurred: {str(e)}"), 500

@app.route('/login', methods=['POST'])
def add_login():
    login_data = request.json
    #print(f"Received login data: {login_data}")
    try:
        user = mongo.db.user_RegisterData.find_one({
            "username": login_data["username"],
            "password": login_data["password"]
        })
        if user:
            return jsonify(message="Login successful"), 200
        else:
            return jsonify(message="Invalid username or password"), 401
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(message=f"An error occurred: {str(e)}"), 500

@app.route('/sign-up', methods=['POST'])
def add_signup():
    signup_data = request.json
    #print(f"Received Signed Up data: {signup_data}")
    try:
        existing_user = mongo.db.user_RegisterData.find_one({"username": signup_data["username"]})
        if existing_user:
            return jsonify(message="Username already exists"), 409
        mongo.db.user_RegisterData.insert_one(signup_data)
        return jsonify(message="Sign Up added"), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(message=f"An error occurred: {str(e)}"), 500
    
# In-memory store for OTPs
otp_store = {}

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    phone = request.json.get("phone")
    user = mongo.db.user_RegisterData.find_one({"phone": phone})
    if user:
        otp = random.randint(100000, 999999)
        otp_store[phone] = otp
        # Send OTP to user's phone (simulation)
        print(f"OTP for {phone}: {otp}")
        return jsonify(message="OTP sent",otp=otp), 200
    else:
        return jsonify(message="Phone number not found"), 404

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    phone = request.json.get("phone")
    otp = request.json.get("otp")
    if otp_store.get(phone) == int(otp):
        user = mongo.db.user_RegisterData.find_one({"phone": phone})
        del otp_store[phone]  # Clear OTP after successful verification
        return jsonify(username=user["username"], password=user["password"]), 200
    else:
        return jsonify(message="Invalid OTP"), 400


@app.route('/profile', methods=['GET'])
def get_profile():
    # Replace this with actual user ID obtained from the session or token
    user_id = "user_id"
    user = mongo.db.user_RegisterData.find_one({"_id": user_id})
    if user:
        return jsonify(username=user["username"], email=user["email"], phone=user["phone"]), 200
    else:
        return jsonify(message="User not found"), 404

@app.route('/update-profile', methods=['POST'])
def update_profile():
    user_id = "user_id"  # Replace this with actual user ID obtained from the session or token
    data = request.json
    update_result = mongo.db.user_RegisterData.update_one(
        {"_id": user_id},
        {"$set": {"username": data["username"], "email": data["email"], "phone": data["phone"]}}
    )
    if update_result.matched_count > 0:
        return jsonify(message="Profile updated successfully"), 200
    else:
        return jsonify(message="User not found"), 404



if __name__ == '__main__':
    app.run(debug=True)
>>>>>>> dbb2147506cfa3c7b243884bb92c0f50064da7a5
