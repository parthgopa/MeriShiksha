import styles from "./Questions.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../LoadingSpinner";
import APIService from "../API";
import Answer from "./Answers";

const Questions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, level, numMCQs } = location.state;

  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const answerRef = useRef(false);

  useEffect(() => {
    let prompt;
    if (level === "College Level") {
      prompt = `As a college student, generate a set of MCQs on ${topic} at the '${level}' level .  Include ${numMCQs} MCQs and The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };. The output should be in the same format as given with curly braces.`;
    } else {
      prompt = `Generate ${numMCQs} MCQs for the topic '${topic}' at '${level}' level. The output should be a valid JSON object in the following format:
    {
      "questions": ["What is the capital of France?", "What is 2 + 2?"],
      "options": [
        ["Berlin", "Madrid", "Paris", "Rome"],
        ["3", "4", "5", "6"]
      ],
      "correctAnswers": ["Paris", "4"]
    }; . The output should be in the same format as given with curly braces.`;
    }
    const fetchMCQs = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [numMCQs, topic, level]);

  const copyToClipboard = () => {
    const content = questions
      .map(
        (q, index) =>
          `${index + 1}. ${q}\nOptions:\n${options[index]
            .map((opt, i) => `${String.fromCharCode(97 + i)}) ${opt}`)
            .join("\n")}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(content);
    alert("Questions copied to clipboard successfully.");
  };

  const handleOnResponse = (response) => {
    try {
      let mcqData = response["candidates"][0]["content"]["parts"][0]["text"];
      mcqData = mcqData.slice(7, mcqData.length - 4);
      mcqData = JSON.parse(mcqData);

      setQuestions(mcqData.questions);
      setOptions(mcqData.options);
      setCorrectAnswers(mcqData.correctAnswers);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      navigate("/error", { state: { error: "Invalid JSON response" } });
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  const handleShowAnswer = () => {
    setShowAnswers(!showAnswers);
    if (!showAnswers) {
      setTimeout(
        () => answerRef.current.scrollIntoView({ behavior: "smooth" }),
        100
      ); //To scroll the page up so user see the correct answers.
    }
  };

  return (
    <div>
      <form>
        <div className={styles.formGroup}>
          <h3>Questions</h3>
          <textarea
            className={`form-control ${styles.formControl}`}
            id="paragraphInput"
            rows="15"
            value={questions
              .map(
                (q, index) =>
                  `${index + 1}. ${q}\nOptions:\n${options[index]
                    .map((opt, i) => `${String.fromCharCode(97 + i)}) ${opt}`)
                    .join("\n")}`
              )
              .join("\n\n")}
            readOnly
          ></textarea>
        </div>
        <div className="d-flex h-100">
          <div className="align-self-start mr-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
          <div className="align-self-center mx-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={copyToClipboard}
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="align-self-end ml-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleShowAnswer}
            >
              Correct Answers
            </button>
          </div>
        </div>
        {showAnswers && (
          <div ref={answerRef}>
            <Answer
              correctAnswers={correctAnswers}
              closeAnswer={() => setShowAnswers(false)}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default Questions;
