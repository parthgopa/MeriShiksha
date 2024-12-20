import React, { useState } from "react";
import styles from "./DotPointSummary.module.css";
import { useNavigate } from "react-router";

const DotPointSummary = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    const level = levelentry;

    //navigate to questions page.
    navigate("./summary-page", {
      state: {
        topic: topic,
        level: level,
      },
    });
  };

  const handleLevelChange = (e) => {
    setlevelentry(e.target.value);
  };
  return (
    <div className={styles.container}>
      <h2>Dot Point Summary</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Topic Entry</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="Enter topic"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="summaryLevel">Level of the Topic</label>
          <select
            className={`form-control ${styles.formControl}`}
            id="summaryLevel"
            onChange={handleLevelChange}
          >
            <option>Primary</option>
            <option>Secondary</option>
            <option>Advance</option>
          </select>
        </div>
        <center>
          <button
            type="submit"
            className={`btn btn-success ${styles.subnitButton}`}
          >
            Submit
          </button>
        </center>
      </form>
    </div>
  );
};

export default DotPointSummary;
