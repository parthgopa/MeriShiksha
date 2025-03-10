import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import APIService from "../API";
import styles from "./FinalResult.module.css";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown"; // Add this import

ChartJS.register(ArcElement, Tooltip, Legend);

const FinalResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userAnswers, correctAnswers, questions } = location.state;

  const [selectedDescription, setSelectedDescription] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateScore = () => {
    let score = 0;
    Object.keys(userAnswers).forEach((key) => {
      if (userAnswers[key] === correctAnswers[key]) {
        score += 1;
      }
    });
    return score;
  };

  const handleDescriptionFetch = async (question, correctAnswer) => {
    console.log(question, correctAnswer);
    setLoading(true);
    setSelectedDescription(null);

    const prompt = `
      For the following multiple-choice question, provide a clear and concise explanation for why the correct answer is correct. . Keep the explanation short and to the point.
  
      Question: ${question}
      Correct Answer: ${correctAnswer}
      
      Please ensure the explanation highlights the key reasons for the correctness of the correct answer and the flaws in the incorrect answers.
    `;

    await APIService({
      question: prompt,
      onResponse: (response) => {
        if (response.error) {
          setSelectedDescription(response.error);
        } else {
          setSelectedDescription(
            response["candidates"][0]["content"]["parts"][0]["text"]
          );
        }
        setLoading(false);
      },
    });
  };

  const score = calculateScore();
  const totalQuestions = Object.keys(correctAnswers).length;
  const incorrectAnswers = totalQuestions - score;

  const data = {
    labels: ["Correct Answers", "Wrong Answers"],
    datasets: [
      {
        data: [score, incorrectAnswers],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#c82333"],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>MCQ Test Result</h2>

      {/* Pie Chart */}
      <div className={styles.chartContainer}>
        <Pie data={data} />
      </div>

      {/* Score Summary */}
      <div className={styles.summary}>
        <p className={styles.scoreText}>
          <strong>You Scored:</strong> {score} / {totalQuestions}
        </p>
        <p className={styles.detailsText}>
          <strong>Correct:</strong> {score} | <strong>Incorrect:</strong>{" "}
          {incorrectAnswers}
        </p>
      </div>

      {/* Evaluation Table */}
      <div className={styles.evaluationSection}>
        <h3 className={styles.evaluationHeading}>Detailed Evaluation</h3>
        <table className={styles.evaluationTable}>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Question</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(questions).map((key, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{questions[key]}</td>
                <td
                  className={
                    userAnswers[key] === correctAnswers[key]
                      ? styles.correctAnswer
                      : styles.wrongAnswer
                  }
                >
                  {userAnswers[key] || "No Answer"}
                </td>
                <td>{correctAnswers[key]}</td>
                <td>
                  {userAnswers[key] === correctAnswers[key] ? (
                    <span className={styles.correct}>Correct</span>
                  ) : (
                    <span className={styles.incorrect}>Incorrect</span>
                  )}
                </td>
                <td>
                  {userAnswers[key] !== correctAnswers[key] && (
                    <button
                      className={styles.fetchButton}
                      onClick={() =>
                        handleDescriptionFetch(
                          questions[key], // The question
                          correctAnswers[key] // The correct answer
                        )
                      }
                    >
                      Explain
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Description */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        selectedDescription && (
          <ReactMarkdown
            className={`form-control ${styles.textArea}`}
            children={selectedDescription}
          />
        )
      )}

      {/* Navigation Buttons */}
      <div className={styles.buttonContainer}>
        <button className="btn btn-primary" onClick={() => navigate("/app")}>
          Home
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/quiz")}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default FinalResult;
