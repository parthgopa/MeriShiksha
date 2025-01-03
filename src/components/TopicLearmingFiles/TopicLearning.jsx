import React, { useRef, useState } from "react";
import styles from "./TopicLearning.module.css";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const TopicLearning = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const [warning, setwarning] = useState(false);
  const topic = useRef("");
  const parts = useRef("");
  const navigate = useNavigate();
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topicValue = e.target[0].value;
    const levelValue = levelentry;
    const partsValue = e.target[2].value;

    const initialPrompt = `I am a beginner in the topic :${topicValue}. Provide content for Part 1, including a basic introduction, definition, and historical background. Cover the key points and relevance of :${topicValue} in a way suitable for a beginner for date: ${date} and time :${time}`;

    let data = {
      topic: topicValue,
      level: levelValue,
      parts: partsValue,
      initialPrompt: initialPrompt,
    };
    if (topicValue && levelValue && partsValue) {
      setwarning(false);
      navigate("/learning-topic", { state: data });
    } else {
      setwarning(true);
    }
    //<LearningTopic state={data} />;
    //       topic.current = "";
    //       setlevelentry("");
    //       parts.current = "";
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
      <h4>Welcome to the Topic Learning</h4>
      <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Enter the Topic</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            placeholder="Space, Magic, Science etc.."
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
            In How Many Parts Do You Want to Learn (max 5)
          </label>
          <input
            type="number"
            className={`form-control ${styles.formControl}`}
            id="topicParts"
            placeholder="e.g 1,2, . ."
            max="5"
            min="1"
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

export default TopicLearning;
