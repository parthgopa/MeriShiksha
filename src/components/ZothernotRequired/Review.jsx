import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./ReviewSection.module.css";

const ReviewSection = () => {
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      setMessage("Please enter a review before submitting.");
      setIsFading(false);
      return;
    }

    try {
      // const response = await axios.post(
      //   "https://merishiksha.com/submit-review", // For website on server side use THIS.
      //   {
      //     review,
      //   }
      // );
      const response = await axios.post(
        "https://merishiksha.com/submit-review", // Local testing endpoint
        {
          review,
        }
      );

      setMessage(response.data.message || "Review submitted successfully!");
      setIsFading(false);
      setReview(""); // Clear the textarea

      // Start the fade-out effect
      setTimeout(() => {
        setIsFading(true); // Trigger CSS fade-out
        setTimeout(() => setMessage(""), 500); // Clear message after fade-out
      }, 2500);
    } catch (error) {
      setMessage("Failed to submit review. Please try again.");
      setIsFading(false);
      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => setMessage(""), 500);
      }, 2500);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2 className="mb-2">We Value Your Feedback</h2>
              <p className="mb-0">Help us improve by sharing your thoughts!</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here..."
                    rows="6"
                    className="form-control"
                    style={{ resize: "none" }}
                  ></textarea>
                </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-success mx-2">
                    Submit Review
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => navigate("/")}
                  >
                    Home
                  </button>
                </div>
              </form>
              {message && (
                <div
                  className={`alert alert-info mt-4 text-center ${
                    isFading ? styles.fadeOut : ""
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
