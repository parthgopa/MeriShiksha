import styles from "./Questions.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../LoadingSpinner";
import APIService from "../API";
import Answer from "./Answers";
// import { TiArrowBack } from "react-icons/ti";
// import { IoCopy } from "react-icons/io5";
// import { FcAnswers } from "react-icons/fc";
// import { CiTextAlignCenter, CiTextAlignLeft } from "react-icons/ci";
import HomeButton from "../HomeButton";

const Questions = () => {
  const location = useLocation(null);
  const navigate = useNavigate();
  const { topic, level, numMCQs } = location.state;

  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const answerRef = useRef(false);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  useEffect(() => {
    let prompt;
    if (level === "College Level") {
      prompt = `As a college student, generate a Randomized set of MCQs on ${topic} at the '${level}' level .  Include ${numMCQs} MCQs and The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };. For current date: ${date} and time : ${time}`;
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

      console.log(mcqData.correctAnswers);

      setQuestions(mcqData.questions || []);
      setOptions(mcqData.options || []);
      setCorrectAnswers(mcqData.correctAnswers || []);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  const handleShowAnswer = () => {
    setShowAnswers(!showAnswers);
    if (!showAnswers) {
      setTimeout(
        () => answerRef.current.scrollIntoView({ behavior: "smooth" }),
        10
      ); //To scroll the page up so user see the correct answers.
    }
  };

  return (
    <div>
      <form className={styles.container}>
        <div className={styles.formGroup}>
          <h6 style={{ textAlign: "right" }}>MCQ Generation</h6>
          <>
            <h3 style={{ textAlign: "center" }}>Questions</h3>
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
          </>
        </div>
        <div className={`${styles.buttonGroup}`}>
          <div>
            <button
              type="button"
              className={`btn btn-primary ${styles.button}`}
              onClick={() => navigate(-1)}
            >
              {/* <TiArrowBack /> */}
              Back
            </button>
          </div>
          <div>
            <button
              type="button"
              className={`btn btn-primary ${styles.button}`}
              onClick={copyToClipboard}
            >
              Copy to Clipboard{" "}
            </button>
          </div>
          <div>
            <button
              type="button"
              className={`btn btn-success ${styles.button}`}
              onClick={handleShowAnswer}
            >
              Corrrect Answers{" "}
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
      {/* <HomeButton /> */}
    </div>
  );
};

export default Questions;
