import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../LoadingSpinner";
import APIService from "../API";
import Answer from "./Answers";
import ReactMarkdown from "react-markdown";
import BlackLoadingSpinner from "../BlackLoadingSpinner";
import { FaArrowLeft, FaCopy, FaCheckCircle } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import "./Questions.css";

const Questions = () => {
  const location = useLocation(null);
  const navigate = useNavigate();
  const { subject, topic, level, numMCQs } = location.state;

  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const answerRef = useRef(false);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  useEffect(() => {
    let prompt;
    if (level === "College Level") {
      prompt = `As a college student, generate a Randomized set of MCQs on topic : '${topic}' ${
        subject && `incontext of subject :'${subject}'`
      } at '${level}' level .  Include ${numMCQs} MCQs and The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };. For current date: ${date} and time : ${time}(dont display it in output)`;
    } else {
      prompt = `Generate ${numMCQs} MCQs for the topic : '${topic}' ${
        subject && `incontext of subject :'${subject}'`
      } at '${level}' level. The output should be a valid JSON object in the following format:
    {
      "questions": ["What is the capital of France?", "What is 2 + 2?"],
      "options": [
        ["Berlin", "Madrid", "Paris", "Rome"],
        ["3", "4", "5", "6"]
      ],
      "correctAnswers": ["Paris", "4"]
    }; . For current date: ${date} and time : ${time}(dont display it in output)`;
    }
    const fetchMCQs = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [numMCQs, topic, level, subject, date, time]);

  const copyToClipboard = () => {
    const content = questions
      .map(
        (q, index) =>
          `${index + 1}. ${q}\nOptions:\n${options[index]
            .map((opt, i) => `${String.fromCharCode(97 + i)}) ${opt}`)
            .join("\n")}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleOnResponse = (response) => {
    try {
      let mcqData = response["candidates"][0]["content"]["parts"][0]["text"];
      mcqData = mcqData.slice(7, mcqData.length - 4);
      mcqData = JSON.parse(mcqData);

      setQuestions(mcqData.questions || []);
      setOptions(mcqData.options || []);
      setCorrectAnswers(mcqData.correctAnswers || []);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswers(!showAnswers);
    if (!showAnswers) {
      setTimeout(
        () => answerRef.current.scrollIntoView({ behavior: "smooth" }),
        10
      ); //To scroll the page up so user see the correct answers.
    }
  };

  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const input = document.getElementById("container");
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdfWidth = canvas.width * 0.75; // Convert pixels to points
        const pdfHeight = canvas.height * 0.75; // Convert pixels to points

        // Create the PDF document with custom dimensions
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`MCQs - ${topic}.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  if (loading) {
    return (
      <div className="questions-loading">
        <div className="questions-loading-content">
          <BlackLoadingSpinner />
          <p className="questions-loading-text">Generating your questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <div className="questions-content" id="container">
        <div className="questions-card">
          <div className="questions-header">
            <div className="questions-title-row">
              <h2 className="questions-title">
                Multiple Choice Questions
              </h2>
              <div className="questions-level-badge">
                {level}
              </div>
            </div>
          
            <div className="questions-info">
              <div className="questions-info-badge">
                <span className="questions-info-label">Subject:</span> {subject}
              </div>
              <div className="questions-info-badge">
                <span className="questions-info-label">Topic:</span> {topic}
              </div>
              <div className="questions-info-badge">
                <span className="questions-info-label">Questions:</span> {numMCQs}
              </div>
            </div>
          </div>

          <div 
            id="output-container" 
            className="questions-output"
          >
            <ReactMarkdown
              className="questions-markdown"
              children={questions
                .map(
                  (q, index) =>
                    `**${index + 1}. ${q}**\n\n**Options:**\n${options[index]
                      .map(
                        (opt, i) => `- ${String.fromCharCode(97 + i)}) ${opt}`
                      )
                      .join("\n")}`
                )
                .join("\n\n")}
            />
          </div>

          <div className="questions-actions">
            
            <div className="questions-actions-row">
              <button
                onClick={copyToClipboard}
                className={`questions-btn questions-btn-copy ${copySuccess ? 'copied' : ''}`}
              >
                {copySuccess ? (
                  <>
                    <FaCheckCircle className="questions-btn-icon success" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="questions-btn-icon" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleShowAnswer}
                className="questions-btn questions-btn-answers"
              >
                <IoDocumentTextOutline className="questions-btn-icon" />
                <span>{showAnswers ? "Hide Answers" : "Show Answers"}</span>
              </button>
            </div>
          </div>
        </div>
        
        {showAnswers && (
          <div ref={answerRef} className="questions-answer-section">
            <Answer
              correctAnswers={correctAnswers}
              closeAnswer={() => setShowAnswers(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
