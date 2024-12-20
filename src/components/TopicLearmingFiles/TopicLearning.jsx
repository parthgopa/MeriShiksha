import React, { useRef, useState } from "react";
import styles from "./TopicLearning.module.css";
import { useNavigate } from "react-router";

const TopicLearning = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const topic = useRef("");
  const parts = useRef("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topicValue = e.target[0].value;
    const levelValue = levelentry;
    const partsValue = e.target[2].value;

    const initialPrompt = `I am a beginner in the topic :${topicValue}. Provide content for Part 1, including a basic introduction, definition, and historical background. Cover the key points and relevance of :${topicValue} in a way suitable for a beginner.`;

    let data = { topic:topicValue, level:levelValue, parts:partsValue,initialPrompt:initialPrompt };


    navigate("/learning-topic", { state: data });

    //<LearningTopic state={data} />;
    //       topic.current = "";
    //       setlevelentry("");
    //       parts.current = "";
  };

  const handleLevelChange = (e) => {
    setlevelentry(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h2>Welcome to the Topic Learning</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Enter the Topic</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="Enter topic"
            ref={topic}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="topicLevel">Level of the Topic</label>
          <select
            className={`form-control ${styles.formControl}`}
            id="topicLevel"
            value={levelentry}
            onChange={handleLevelChange}
          >
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Advance">Advance</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="topicParts">
            In How Many Parts Do You Want to Learn
          </label>
          <input
            type="number"
            className={`form-control ${styles.formControl}`}
            id="topicParts"
            placeholder="Enter number of parts"
            max="5"
            ref={parts}
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

export default TopicLearning;
