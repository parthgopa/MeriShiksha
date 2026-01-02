import React, { useState } from "react";
import { FaTimes, FaCopy, FaCheckCircle } from "react-icons/fa";
import "./Answers.css";

const Answer = ({ correctAnswers, closeAnswer }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    const content = correctAnswers
      .map((answer, index) => `${index + 1}. ${answer}`)
      .join("\n");
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="answers-card">
      <div className="answers-header">
        <h3 className="answers-title">
          Correct Answers
        </h3>
        <button 
          onClick={closeAnswer}
          className="answers-close-btn"
          aria-label="Close answers"
        >
          <FaTimes />
        </button>
      </div>

      <div 
        id="answer-container"
        className="answers-container"
      >
        {correctAnswers.length > 0 ? (
          correctAnswers.map((answer, index) => (
            <div 
              key={index} 
              className="answers-item"
            >
              <div className="answers-item-content">
                <span className="answers-item-number">
                  {index + 1}
                </span>
                <p className="answers-item-text">{answer}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="answers-empty">
            <div className="answers-empty-icon">📝</div>
            <div className="answers-empty-text">No answers available</div>
            <div className="answers-empty-subtext">Please generate questions first</div>
          </div>
        )}
      </div>

      <div className="answers-actions">
        <button
          onClick={copyToClipboard}
          className={`answers-copy-btn ${copySuccess ? 'copied' : ''}`}
          disabled={correctAnswers.length === 0}
        >
          {copySuccess ? (
            <>
              <FaCheckCircle className="answers-copy-icon success" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FaCopy className="answers-copy-icon" />
              <span>Copy All Answers</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Answer;
