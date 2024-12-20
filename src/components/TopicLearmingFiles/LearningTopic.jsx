import React, { useState, useEffect, useRef } from "react";
import styles from "./LearningTopic.module.css";
import APIService from "../API"; // Assuming you have an API service to handle it
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown"; // Add this import
import LoadingSpinner from "../LoadingSpinner"; // Import the LoadingSpinner component
import { useSpeechSynthesis } from "react-speech-kit"; // Import useSpeechSynthesis

const LearningTopic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topic, level, parts, initialPrompt } = location.state;

  const [currentPart, setCurrentPart] = useState(1);
  const [response, setResponse] = useState(initialPrompt);
  const [loading, setLoading] = useState(false); // Add loading state
  const [speechRate, setSpeechRate] = useState(1); // State for speech rate
  const cacheRef = useRef({}); // Cache object to store responses
  const [currentSpeechResponse, setSpeechResponse] = useState("");

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();

  const handleOnResponse = (part, response) => {
    const responseText =
      response["candidates"][0]["content"]["parts"][0]["text"];
    let SpeechResponse = responseText.slice(3, responseText.length);
    setSpeechResponse(SpeechResponse);

    setResponse(responseText);
    setLoading(false); // Stop spinner once response is received

    // Save response to cache
    cacheRef.current[part] = {
      prompt: part,
      response: responseText,
    };
  };

  useEffect(() => {
    const fetchInitialContent = async () => {
      setLoading(true); // Start spinner when making API call

      // Check cache for the initial part
      if (cacheRef.current[currentPart]) {
        setResponse(cacheRef.current[currentPart].response);
        setLoading(false);
      } else {
        await APIService({
          question: initialPrompt,
          onResponse: (response) => handleOnResponse(currentPart, response),
        });
      }
    };

    fetchInitialContent();
  }, [initialPrompt]);

  const handleNext = async () => {
    if (currentPart < parts) {
      const nextPart = currentPart + 1;

      if (cacheRef.current[nextPart]) {
        setResponse(cacheRef.current[nextPart].response);
        setCurrentPart(nextPart);
        setLoading(false);
      } else {
        setLoading(true); // Start spinner when making API call

        let newPrompt = "";
        if (nextPart === 2) {
          newPrompt = `I have completed Part 1 of :${topic} and understand its basics. For Part 2, please provide content on the core concepts and fundamental elements of :${topic}. Focus on important terms, key components, and foundational ideas to build a solid understanding.`;
        } else if (nextPart === 3) {
          newPrompt = `Having learned the fundamentals of :${topic}, I am ready for Part 3. Provide an overview of the advanced concepts and applications of :${topic}, explaining how it is applied in real-world scenarios and its impact on related fields.`;
        } else if (nextPart === 4) {
          newPrompt = `I have completed Parts 1 to 3 of :${topic}. For Part 4, provide content on the current trends, contemporary issues, and recent developments in :${topic}. Include challenges, innovations, and the evolving role of 'XYZ' in society.`;
        } else if (nextPart === 5) {
          newPrompt = `With Parts 1 to 4 of :${topic} complete, please provide content for Part 5 that explores the future prospects of :${topic}, potential career paths, and upcoming advancements. Highlight opportunities for further learning and professional growth in this field.`;
        }

        await APIService({
          question: newPrompt,
          onResponse: (response) => handleOnResponse(nextPart, response),
        });

        setCurrentPart(nextPart);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPart > 1) {
      const prevPart = currentPart - 1;

      if (cacheRef.current[prevPart]) {
        setResponse(cacheRef.current[prevPart].response);
        setCurrentPart(prevPart);
        setLoading(false);
      } else {
        setLoading(true); // Start spinner when making API call

        const prevPrompt = `I am a beginner and I want to learn ${topic} having a level of ${level} and in ${parts} parts. I had learned part ${currentPart} of the topic, now go to previous part of it.`;

        APIService({
          question: prevPrompt,
          onResponse: (response) => handleOnResponse(prevPart, response),
        });

        setCurrentPart(prevPart);
      }
    }
  };

  const handleFinish = () => {
    const data = { topic: topic, level: level };
    navigate("/finished-learning", { state: data });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response).then(() => {
      alert("Copied to clipboard successfully.");
    });
  };

  const handleSpeak = () => {
    if (currentSpeechResponse) {
      speak({ text: currentSpeechResponse, rate: speechRate });
    }
  };

  const handleStop = () => {
    cancel();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* <h3>
          Learning Part: {currentPart} of {topic}
        </h3> */}
        {supported && (
          <div className={styles.speechControls}>
            <button className="btn btn-outline-primary" onClick={handleSpeak}>
              {speaking ? "Speaking..." : "Speak"}
            </button>
            <button className="btn btn-outline-danger" onClick={handleStop}>
              Stop
            </button>
            <label>
              Speed:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(e.target.value)}
              />
              <span className={styles.sliderValue}>{speechRate}</span>
            </label>
          </div>
        )}
      </div>
      {loading ? (
        <LoadingSpinner /> // Render spinner when loading
      ) : (
        <ReactMarkdown
          className={`form-control ${styles.textArea}`}
          children={response}
        />
      )}
      <div className={styles.buttonGroup}>
        <button
          className={`btn btn-primary ${styles.button}`}
          onClick={handlePrevious}
          disabled={currentPart === 1 || loading}
        >
          Previous
        </button>
        <button
          className={`btn btn-primary ${styles.button}`}
          onClick={handleNext}
          disabled={currentPart === parts || loading}
        >
          Next
        </button>
        <button
          className={`btn btn-success ${styles.button}`}
          onClick={handleFinish}
          disabled={currentPart != parts || loading}
        >
          Finish
        </button>
        <button className="btn btn-secondary" onClick={handleCopyToClipboard}>
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default LearningTopic;
