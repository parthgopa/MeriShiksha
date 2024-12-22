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
