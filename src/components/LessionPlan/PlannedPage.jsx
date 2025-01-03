import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";

import styles from "./PlannedPage.module.css";
import { Button, Container } from "react-bootstrap";
import HomeButton from "../HomeButton";
const PlannedPage = () => {
  const [plan, setplan] = useState("none");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, topic, time } = location.state;
  const date = new Date().toDateString();
  const Time = new Date().toTimeString();

  useEffect(() => {
    let prompt = `I want to learn the following topic so design a Randomized lesson plan for  learning following topic in ${time}.
Subject- ${subject} 
Topic - ${topic}, 
Prepare brief note based on provided subject, example of topic and also prepare dot point note for my exam time reading. For current date:${date} and time:${Time}`;

    const fetchMCQs = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [topic, subject, time]);

  const handleOnResponse = (response) => {
    try {
      setplan(response["candidates"][0]["content"]["parts"][0]["text"]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(plan).then(() => {
      alert("Copied to clipboard successfully.");
    });
  };
  return (
    <Container
      style={{
        background: "linear-gradient(to right, #5a8bdb, #dfb181)",
        minHeight: "95vh",
      }}
    >
      <form>
        <div className={styles.formGroup}>
          <h5 style={{ textAlign: "center", marginTop: "0rem" }}>
            Plan of : {subject} & Topic-{topic}
          </h5>
          {loading ? (
            <LoadingSpinner /> // Render spinner when loading
          ) : (
            <ReactMarkdown
              className={`form-control ${styles.textArea}`}
              children={plan}
            />
          )}
        </div>
        <div
          className={`d-flex h-100 justify-content-between ${styles.buttoncontainer}`}
        >
          <div className="align-self-start">
            <Button className="btn btn-primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
          <div className="align-self-start">
            <Button className="btn btn-primary" onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </form>
      <HomeButton />
    </Container>
  );
};
export default PlannedPage;
