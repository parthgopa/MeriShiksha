import styles from "./Answer.module.css";
import React, { useState } from "react";
import { FaTimes, FaCopy, FaCheckCircle } from "react-icons/fa";

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
    <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
          Correct Answers
        </h3>
        <button 
          onClick={closeAnswer}
          className="p-2 rounded-full bg-[var(--primary-black)]/60 hover:bg-[var(--primary-black)] transition-all text-white"
          aria-label="Close answers"
        >
          <FaTimes />
        </button>
      </div>

      <div 
        id="answer-container"
        className="bg-[var(--primary-black)]/60 p-6 rounded-xl border border-[var(--accent-teal)]/20 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar"
      >
        {correctAnswers.map((answer, index) => (
          <div 
            key={index} 
            className="mb-4 p-3 rounded-lg bg-[var(--primary-black)]/40 border-l-4 border-[var(--accent-teal)]"
          >
            <div className="flex items-start gap-2">
              <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-[var(--accent-teal)]/20 text-[var(--accent-teal)] text-sm font-bold">
                {index + 1}
              </span>
              <p className="text-white">{answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={copyToClipboard}
          className="px-6 py-3 bg-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--primary-black)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
        >
          {copySuccess ? (
            <>
              <FaCheckCircle className="text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FaCopy className="text-[var(--accent-teal)]" />
              <span>Copy All Answers</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Answer;
