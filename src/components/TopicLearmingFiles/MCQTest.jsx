import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import styles from "./MCQTest.module.css";
import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";

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
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  useEffect(() => {
    const fetchMCQs = async () => {
      let prompt;
      if (incomingdata === "FromParagraph") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the Paragraph Provided =>: "${topic}" at '${level}' level. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }; For current date :${date} and current time :${time}`;
      } else if (incomingdata === "FromTopicLearning") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the topic '${topic}' at '${level}' level. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };  For current date :${date} and current time :${time}`;
      } else if (incomingdata === "RetakeMCQs") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the topic '${topic}' at '${level}' level different from the previous one. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };  For current date :${date} and current time :${time}`;
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
    navigate("/final-result", {
      state: { userAnswers, correctAnswers, questions, topic, level },
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.quizWrap}>
      {incomingdata === "FromTopicLearning" && (
        <h3>
          MCQ Quiz: {topic} ({level})
        </h3>
      )}
      {incomingdata === "FromParagraph" && <h1>MCQ Quiz</h1>}
      {incomingdata === "RetakeMCQs" && <h1> ReTest</h1>}

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className={styles.mcq}>
        <h5 className={styles.quizQn}>{`(${currentQuestionIndex + 1}/${
          questions.length
        }) ${questions[currentQuestionIndex]}`}</h5>
        <div className={styles.quizAns}>
          {options[currentQuestionIndex].map((option, idx) => (
            <div key={idx} className={styles.option}>
              <input
                type="radio"
                id={`mcq-${currentQuestionIndex}-option-${idx}`}
                name={`mcq-${currentQuestionIndex}`}
                value={option}
                checked={userAnswers[currentQuestionIndex] === option}
                onChange={() =>
                  handleAnswerChange(currentQuestionIndex, option)
                }
                className={styles.radioInput}
              />
              <label
                htmlFor={`mcq-${currentQuestionIndex}-option-${idx}`}
                className={styles.radioLabel}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={` ${styles.previousButton}`}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className={` ${styles.nextButton}`}
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
        <button
          className={` ${styles.finishButton}`}
          onClick={handleFinish}
          disabled={currentQuestionIndex !== questions.length - 1}
        >
          Finish
        </button>
      </div>
      <HomeButton />
    </div>
  );
};

export default MCQTest;
