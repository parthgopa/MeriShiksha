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
      <h3 className="text-2xl font-bold text-center mb-6 text-white">
        Correct Answers
      </h3>
      <div className="min-h-[400px] bg-gradient-to-b from-secondary via-black to-secondary p-6 rounded-lg shadow-lg">
        <>
          <div
            className="p-4 rounded-lg bg-secondary text-white overflow-auto max-h-96"
            id="answer-container"
          >
            {correctAnswers.map((answer, index) => (
              <p key={index} className="text-white mb-2">
                <strong>{index + 1}.</strong> {answer}
              </p>
            ))}
          </div>
          <div className="flex justify-between mt-6 gap-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
              onClick={closeAnswer}
            >
              Close
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
              onClick={copyToClipboard}
            >
              Copy to Clipboard
            </button>
          </div>
        </>
      </div>
    </>
  );
};

export default Answer;
