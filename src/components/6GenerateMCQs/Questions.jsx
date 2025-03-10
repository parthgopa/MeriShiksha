import styles from "./Questions.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../LoadingSpinner";
import APIService from "../API";
import Answer from "./Answers";
import ReactMarkdown from "react-markdown"; // Add this import
import BlackLoadingSpinner from "../BlackLoadingSpinner";

// import { TiArrowBack } from "react-icons/ti";
// import { IoCopy } from "react-icons/io5";
// import { FcAnswers } from "react-icons/fc";
// import { CiTextAlignCenter, CiTextAlignLeft } from "react-icons/ci";

const Questions = () => {
  const location = useLocation(null);
  const navigate = useNavigate();
  const { subject, topic, level, numMCQs } = location.state;

  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
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
  }, [numMCQs, topic, level]);

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
    alert("Questions copied to clipboard successfully.");
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

  if (loading) {
    return <BlackLoadingSpinner />;
  }
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
        pdf.save(`Lesson Plan.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex justify-center items-center">
      <form className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black">
        <h6 className="text-right text-lg font-medium text-white">
          MCQ Generation
        </h6>
        <div className="space-y-4">
          <h3
            className="text-2xl font-bold text-center text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Questions
          </h3>
          <div
            id="output-container"
            className="p-4 rounded-lg bg-secondary text-white space-y-4"
          >
            <ReactMarkdown
              className="prose prose-invert"
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
        </div>
        <div className="flex justify-between gap-4">
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-cardaccent transition-all transform hover:scale-105"
            onClick={handleShowAnswer}
          >
            Correct Answers
          </button>
        </div>
        {showAnswers && (
          <div ref={answerRef}>
            <Answer
              correctAnswers={correctAnswers}
              closeAnswer={() => setShowAnswers(false)}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default Questions;
