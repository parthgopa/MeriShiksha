import React, { useState } from "react";
import styles from "./lessionpage.module.css";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const LessonPage = () => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = e.target[0].value;
    const topic = e.target[1].value;
    const time = e.target[2].value;

    if (subject && topic && time) {
      navigate("/lessonpage/planned-page", {
        state: {
          subject: subject,
          topic: topic,
          time: time,
        },
      });
    } else {
      setWarning(true);
    }
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };
  return (
    <div className={styles.container}>
      <h2>Planning of Topic</h2>
      <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
        <div className={styles.formGroup}>
          <label>Enter the Subject to study</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="SubjectEntry"
            placeholder="Gravity, rockets , biopics etc."
          />
        </div>
        <div className={styles.formGroup}>
          <label>Enter the Topic in Subject</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="Newton's Law , Momentum etc."
          />
        </div>
        <div className={styles.formGroup}>
          <label>In how much time you want to study.</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="60 minutes, 5 days, etc."
          />
        </div>
        <center>
          <button
            type="submit"
            className={`btn btn-success ${styles.submitButton}`}
          >
            Submit
          </button>
        </center>
      </form>
      {warning && (
        <div className="alert alert-danger" role="alert">
          Please fill all the fields!
        </div>
      )}
      <HomeButton />
    </div>
  );
};
export default LessonPage;
