import { useState } from "react";
import styles from "./GenerateMCQs.module.css";
import { useNavigate } from "react-router";

const GenerateMCQs = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    const level = levelentry;
    const numMCQs = e.target[2].value;

    //navigate to questions page.
    navigate("/app/generate-mcqs/questions", {
      state: {
        topic: topic,
        level: level,
        numMCQs: numMCQs,
      },
    });
  };

  const handleLevelChange = (event) => {
    setlevelentry(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h2>MCQ Generator</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Enter the topic </label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="Enter topic"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Enter the level of topic </label>
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
            max="10"
            placeholder="Enter number of MCQs"
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
    </div>
  );
};
export default GenerateMCQs;
