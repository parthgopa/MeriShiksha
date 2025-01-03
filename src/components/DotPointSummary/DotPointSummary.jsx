import React, { useState } from "react";
import styles from "./DotPointSummary.module.css";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const DotPointSummary = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    const level = levelentry;

    if (topic && level) {
      navigate("./summary-page", {
        state: {
          topic: topic,
          level: level,
        },
      });
    } else {
      setWarning(true);
    }

    //navigate to questions page.
  };

  const handleLevelChange = (e) => {
    setlevelentry(e.target.value);
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };
  return (
    <div className={styles.container}>
      <h1>Dot Point Summary</h1>
      <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Topic Entry</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="OS, bridges, chips etc .."
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
            className={`btn btn-success ${styles.subnmitButton}`}
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

export default DotPointSummary;
