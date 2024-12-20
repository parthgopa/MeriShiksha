import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import styles from "./MCQTest.module.css";
import LoadingSpinner from "../LoadingSpinner";

const MCQTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, level, numMCQs, comingfrom } = location.state;

  const [incomingdata, setIncomingdata] = useState(comingfrom);
  //console.log(incomingdata);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMCQs = async () => {
      let prompt;
      if (incomingdata === "FromParagraph") {
        prompt = `Generate ${numMCQs} MCQs for the Paragraph Provided =>: "${topic}" at '${level}' level. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };`;
      } else if (incomingdata === "FromTopicLearning") {
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

      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [numMCQs, topic, level]);

  const handleOnResponse = (response) => {
    try {
      let mcqData = response["candidates"][0]["content"]["parts"][0]["text"];
      mcqData = mcqData.slice(7, mcqData.length - 4);
      mcqData = JSON.parse(mcqData);

      // console.log(mcqData.questions);
      // console.log(mcqData.options);
      // console.log(mcqData.correctAnswers);

      try {
        setQuestions(mcqData.questions);
        setOptions(mcqData.options);
        setCorrectAnswers(mcqData.correctAnswers);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        navigate("/error", { h2: "SOlve the error message" });
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    }
    setLoading(false);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    navigate("/final-result", { state: { userAnswers, correctAnswers } });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      {incomingdata === "FromTopicLearning" && (
        <h4>
          MCQ Quiz: {topic} ({level})
        </h4>
      )}
      {incomingdata === "FromParagraph" && <h1>MCQ Quiz</h1>}
      <div className={styles.mcq}>
        <h5>{`(${currentQuestionIndex + 1}/${questions.length}) ${
          questions[currentQuestionIndex]
        }`}</h5>
        {options[currentQuestionIndex].map((option, idx) => (
          <div key={idx} className={styles.option}>
            <input
              type="radio"
              id={`mcq-${currentQuestionIndex}-option-${idx}`}
              name={`mcq-${currentQuestionIndex}`}
              value={option}
              checked={userAnswers[currentQuestionIndex] === option}
              onChange={() => handleAnswerChange(currentQuestionIndex, option)}
            />
            <label htmlFor={`mcq-${currentQuestionIndex}-option-${idx}`}>
              {option}
            </label>
          </div>
        ))}
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={`btn btn-primary ${styles.button}`}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className={`btn btn-primary ${styles.button}`}
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
        <button
          className={`btn btn-success ${styles.button}`}
          onClick={handleFinish}
          disabled={currentQuestionIndex !== questions.length - 1}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default MCQTest;
