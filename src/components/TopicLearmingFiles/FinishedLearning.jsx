import React, { useState } from "react";
import { useNavigate, useLocation, data } from "react-router";
import styles from "./FinishedLearning.module.css";

const FinishedLearning = () => {
  const [showInput, setShowInput] = useState(false);
  const [numMCQs, setNumMCQs] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const { topic, level } = location.state;

  const handleYes = () => {
    setShowInput(true);
  };

  const handleNo = () => {
    navigate("/"); // Navigate back to home or any other component
  };

  const handleSubmit = () => {
    const comingfrom = "FromTopicLearning";
    navigate("/app/mcq-test", {
      state: { topic, level, numMCQs, comingfrom: comingfrom },
    }); // Navigate to MCQ test component with number of MCQs
  };

  return (
    <div className={styles.container}>
      <h2>Finished Learning</h2>
      <p>Would you like to take an MCQ test on what you have learned?</p>
      <div className={styles.buttonGroup}>
        <button
          className={`btn btn-success ${styles.button}`}
          onClick={handleYes}
        >
          Yes
        </button>
        <button
          className={`btn btn-secondary ${styles.button}`}
          onClick={handleNo}
        >
          No
        </button>
      </div>
      {showInput && (
        <div className={styles.mcqInput}>
          <label htmlFor="numMCQs">
            How many MCQs would you like to generate? (max 10)
          </label>
          <input
            type="number"
            id="numMCQs"
            className="form-control"
            value={numMCQs}
            onChange={(e) =>
              setNumMCQs(Math.min(Math.max(e.target.value, 1), 10))
            } // Ensure value is between 1 and 10
            max="10"
            min="1"
          />
          <button className="btn btn-primary mt-2" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default FinishedLearning;
