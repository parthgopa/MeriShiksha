import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";

import styles from "./summaryPage.module.css";
import { Button, Container } from "react-bootstrap";
import HomeButton from "../HomeButton";

const SummaryPage = () => {
  const [summary, setSummary] = useState("none");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { topic, level } = location.state;
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  useEffect(() => {
    let prompt = `Provide a Randimozed concise bullet point summary of ${topic}, covering:
Core Concepts: Definitions, principles, theories.
Real-world Applications: Practical uses and impacts.
Key Theories or Models: Explanations and significance.
Controversies or Debates: Disagreements and potential issues. For date:${date} , time :${time}`;

    const fetchMCQs = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [topic, level]);

  const handleOnResponse = (response) => {
    try {
      setSummary(response["candidates"][0]["content"]["parts"][0]["text"]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summary).then(() => {
      alert("Copied to clipboard successfully.");
    });
  };

  return (
    <Container
      style={{
        background: "linear-gradient(to right, #5a8bdb, #dfb181)",
        minHeight: "90vh",
      }}
    >
      <form>
        <div className={styles.formGroup}>
          <h5 style={{ textAlign: "right", margin: "15px" }}>
            Dot Summary of : {topic} & Level-{level}
          </h5>
          {loading ? (
            <LoadingSpinner /> // Render spinner when loading
          ) : (
            <ReactMarkdown
              className={`form-control ${styles.textArea}`}
              children={summary}
            />
          )}
        </div>
        <div className="d-flex h-100 justify-content-between">
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
        <HomeButton />
      </form>
    </Container>
  );
};

export default SummaryPage;
