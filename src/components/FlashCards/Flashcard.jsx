import { useState } from "react";
import styles from "./Flashcard.module.css";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import APIService from "../API";
import { IoCopy } from "react-icons/io5";
import { useNavigate } from "react-router";

const FlashCard = () => {
  const [loading, setLoading] = useState(false);
  const [flashcard, setFlashcard] = useState("");
  const [warning, setWarning] = useState(false);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target.topicEntry.value.trim();

    if (!topic) {
      setWarning(true);
      return;
    }

    const prompt = `Create Randomized comprehensive flashcards on the topic: ${topic}. Include:

- Key points and important definitions
- Relevant case laws and judicial pronouncements
- Analytical explanations and examples
- Questions on one side and answers on the other

Use clear and concise language, and organize the content in a logical and structured manner. For current date:${date} and time :${time}`;

    setLoading(true);
    APIService({ question: prompt, onResponse: handleOnResponse });
  };

  const handleOnResponse = (response) => {
    try {
      const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        setFlashcard(content);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (flashcard) {
      navigator.clipboard
        .writeText(flashcard)
        .then(() => {
          alert("Copied to clipboard successfully.");
        })
        .catch(() => {
          alert("Failed to copy to clipboard.");
        });
    } else {
      alert("There is no flashcard content to copy.");
    }
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Flash Card</h1>
      <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
        <div className={styles.formGroup}>
          <label htmlFor="topicEntry">Enter Topic</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="topicEntry"
            name="topicEntry"
            placeholder="Springs, graphics, etc"
          />
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${styles.generateButton}`}
        >
          Generate
        </button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        flashcard && (
          <>
            <ReactMarkdown
              className={`form-control ${styles.textArea}`}
              children={flashcard}
            />
            <button
              className={`btn btn-primary ${styles.copyButton}`}
              onClick={handleCopyToClipboard}
            >
              Copy
            </button>
          </>
        )
      )}

      <button
        className={`btn btn-warning ${styles.homeButton}`}
        onClick={() => navigate(-1)}
      >
        Home
      </button>
      {warning && (
        <div className="alert alert-danger" role="alert">
          Please enter a topic to generate a card!
        </div>
      )}
    </div>
  );
};

export default FlashCard;
