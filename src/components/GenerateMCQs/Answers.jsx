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
    <>
      <h3>Correct Answers</h3>
      <div className={styles.container}>
        <>
          <textarea
            className={`form-control ${styles.formControl}`}
            id="answerInput"
            rows="15"
            value={correctAnswers
              .map((answer, index) => `${index + 1}. ${answer}`)
              .join("\n")}
            readOnly
          ></textarea>
          <div className={`${styles.buttonGroup}`}>
            <div>
              <button
                type="button"
                className={`btn btn-primary ${styles.button}`}
                onClick={closeAnswer}
              >
                Close
              </button>
            </div>
            <div className="align-self-end mx-auto">
              <button
                type="button"
                className={`btn btn-primary ${styles.button}`}
                onClick={copyToClipboard}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default Answer;
