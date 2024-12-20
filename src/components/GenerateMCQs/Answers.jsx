import styles from "./Answer.module.css";
import React from "react";

const Answer = ({ correctAnswers, closeAnswer }) => {
  const copyToClipboard = () => {
    const content = correctAnswers
      .map((answer, index) => `${index + 1}. ${answer}`)
      .join("\n");
    navigator.clipboard.writeText(content);
    alert("Answers copied to clipboard successfully.");
  };

  return (
    <div className={styles.container}>
      <>
        <h3>Correct Answers</h3>
        <textarea
          className={`form-control ${styles.formControl}`}
          id="answerInput"
          rows="15"
          value={correctAnswers
            .map((answer, index) => `${index + 1}. ${answer}`)
            .join("\n")}
          readOnly
        ></textarea>
        <div className="d-flex h-100 mt-3">
          <div className="align-self-start mr-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={closeAnswer}
            >
              Close
            </button>
          </div>
          <div className="align-self-end mx-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={copyToClipboard}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default Answer;
