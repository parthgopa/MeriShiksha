import React, { useState } from "react";
import { useNavigate, useLocation, data } from "react-router";
import styles from "./FinishedLearning.module.css";
import HomeButton from "../HomeButton";

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
    navigate("/topic-learning"); // Navigate back to home or any other component
  };

  const handleSubmit = () => {
    const comingfrom = "FromTopicLearning";
    navigate("/mcq-test", {
      state: { topic, level, numMCQs, comingfrom: comingfrom },
    }); // Navigate to MCQ test component with number of MCQs
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Finished Learning</h1>
      <h5>Would you like to take an MCQ test of what you have learned?</h5>
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
          <h5 htmlFor="numMCQs">
            How many MCQs would you like to generate? (max 10)
          </h5>
          <input
            type="number"
            id="numMCQs"
            className="form-control"
            onChange={(e) =>
              setNumMCQs(Math.min(Math.max(e.target.value, 1), 10))
            } // Ensure value is between 1 and 10
            max="10"
            min="1"
          />
          <button
            className="btn btn-primary mt-2"
            onClick={handleSubmit}
            onKeyDown={handleEnterPressed}
          >
            Submit
          </button>
        </div>
      )}
      <HomeButton />
    </div>
  );
};

export default FinishedLearning;
