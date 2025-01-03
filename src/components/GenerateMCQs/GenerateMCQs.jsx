import { useState } from "react";
import styles from "./GenerateMCQs.module.css";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const GenerateMCQs = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const [warning, setwarning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    const level = levelentry;
    const numMCQs = e.target[2].value;

    if (topic && level && numMCQs) {
      setwarning(false);
      navigate("/questions", {
        state: {
          topic: topic,
          level: level,
          numMCQs: numMCQs,
        },
      });
    } else {
      setwarning(true);
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
      <h2>MCQ Generator</h2>
      <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Enter the topic </label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="python , solar system, etc"
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
            {/* <option value="College Level">College Level</option> */}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mcqCount">
            How many MCQs do you want to generate? (max 10)
          </label>
          <input
            type="number"
            className={`form-control ${styles.formControl}`}
            id="mcqCount"
            max="10"
            placeholder="e.g 1,2,.."
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
        {warning && (
          <div className="alert alert-danger" role="alert">
            Please fill all the fields!
          </div>
        )}
      </form>
      <HomeButton />
    </div>
  );
};
export default GenerateMCQs;
