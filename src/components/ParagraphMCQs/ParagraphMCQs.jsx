import React, { useState } from "react";
import styles from "./ParagraphMCQs.module.css";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const ParagraphMCQs = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    const level = levelentry;
    const numMCQs = e.target[2].value;
    const comingfrom = "FromParagraph";

    if (topic && level && numMCQs && comingfrom) {
      navigate("/mcq-test", {
        state: {
          topic: topic,
          level: level,
          numMCQs: numMCQs,
          comingfrom: comingfrom,
        },
      });
    } else {
      setWarning(true);
    }

    //navigate to questions page.
  };

  const handleLevelChange = (event) => {
    setlevelentry(event.target.value);
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };
  return (
    <div className={styles.container}>
      <h2>MCQ Generator from Paragraph</h2>
      <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
        <div className={styles.formGroup}>
          <label htmlFor="paragraphInput">Enter Your Paragraph</label>
          <textarea
            className={`form-control ${styles.formControl}`}
            id="paragraphInput"
            rows="5"
            placeholder="Enter your paragraph here"
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mcqLevel">Level of MCQs Generation</label>
          <select
            className={`form-control ${styles.formControl}`}
            id="topicLevel"
            value={levelentry}
            onChange={handleLevelChange}
          >
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Advance">Advance</option>
            <option value="College Level">College Level</option>
            <option value="School Level">School Level</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mcqCount">
            How many MCQs do you want to generate?
          </label>
          <input
            type="number"
            className={`form-control ${styles.formControl}`}
            id="mcqCount"
            placeholder="Enter number of MCQs"
            max="10"
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

export default ParagraphMCQs;
