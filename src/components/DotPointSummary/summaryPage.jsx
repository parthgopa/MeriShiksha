import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";

import styles from "./summaryPage.module.css";
import { Button, Container, Form } from "react-bootstrap";

const SummaryPage = () => {
  const [summary, setSummary] = useState("none");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { topic, level } = location.state;

  useEffect(() => {
    let prompt = `Provide me a Dot point Summary in the topic : ${topic} having the level ${level}`;

    prompt = `Provide a concise bullet point summary of ${topic}, covering:
Core Concepts: Definitions, principles, theories.
Real-world Applications: Practical uses and impacts.
Key Theories or Models: Explanations and significance.
Controversies or Debates: Disagreements and potential issues.`;

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

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <Container>
      <form>
        <div className={styles.formGroup}>
          <h3>
            Summary for {topic} - Level {level}
          </h3>
          {loading ? (
            <LoadingSpinner /> // Render spinner when loading
          ) : (
            <ReactMarkdown
              className={`form-control ${styles.textArea}`}
              children={summary}
            />
          )}
        </div>
        <div className="d-flex h-100">
          <div className="align-self-start mr-auto">
            <Button className="btn btn-primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
          <div className="align-self-start ml-auto">
            <Button className="btn btn-primary" onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default SummaryPage;
