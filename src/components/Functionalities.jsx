import React from "react";
import functionalities from "../assets/main.jpg";
import Mylogo from "../assets/MyLogo.png";
import homepageimage from "../assets/homepagema.jpg";
import styles from "./Functionalities.module.css";
import { Link, useNavigate } from "react-router"; // Updated import for react-router-dom

const Functionalities = () => {
  const navigate = useNavigate();

  const pages = [
    {
      title: "Topic Learning",
      description: "Explore various topics and enhance your knowledge",
      path: "/topic-learning",
    },
    {
      title: "MCQ Generator",
      description: "Generate multiple-choice questions for practice",
      path: "/generate-mcqs",
    },
    {
      title: "MCQ from paragraph",
      description: "Test your comprehension with passage-based questions",
      path: "/paragraph-mcqs",
    },
    {
      title: "Summarizer",
      description: "Get concise Dot Point summary of a topic",
      path: "/dotpoint-summary",
    },
    {
      title: "Flash Cards",
      description: "Get the Q & A of the topic",
      path: "/flash-cards",
    },
    {
      title: "Lesson Plan",
      description: "Get detailed plan of the topic",
      path: "/lesson-plan",
    },
  ];

  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div style={{ display: "flex" }}>
          <img src={Mylogo} className={styles.logo} />
          <div className={styles.CompanyName}>Parth Infotech</div>
          <div className={` ${styles.MainButton}`}>
            <button
              className={`btn btn-success`}
              onClick={() => {
                navigate("/"); // Navigate to the main page when the button is clicked
              }}
            >
              Main Page
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {pages.map((page, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => navigate(page.path)}
            >
              <h2 className={styles.title}>{page.title}</h2>
              <p className={styles.description}>{page.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Functionalities;
