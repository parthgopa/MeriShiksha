import React from "react";
import { useLocation, useNavigate } from "react-router";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./FinalResult.module.css";
ChartJS.register(ArcElement, Tooltip, Legend);

const FinalResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userAnswers, correctAnswers } = location.state;
  console.log(userAnswers, correctAnswers);

  const calculateScore = () => {
    let score = 0;
    Object.keys(userAnswers).forEach((key) => {
      if (userAnswers[key] === correctAnswers[key]) {
        score += 1;
      }
    });
    return score;
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
      <h2>MCQ Test Result</h2>
      <Pie data={data} />
      <p>
        You Scored : {score} / {totalQuestions}
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
};

export default FinalResult;
