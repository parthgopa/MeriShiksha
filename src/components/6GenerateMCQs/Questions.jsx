import styles from "./Questions.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../LoadingSpinner";
import APIService from "../API";
import Answer from "./Answers";
import ReactMarkdown from "react-markdown";
import BlackLoadingSpinner from "../BlackLoadingSpinner";
import { FaArrowLeft, FaCopy, FaCheckCircle } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

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
      <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] flex justify-center items-center">
        <div className="text-center">
          <BlackLoadingSpinner />
          <p className="mt-4 text-white text-lg animate-pulse">Generating your questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10" id="container">
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Multiple Choice Questions
            </h2>
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">{level}</span>
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">Subject:</span> {subject}
            </div>
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">Topic:</span> {topic}
            </div>
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">Questions:</span> {numMCQs}
            </div>
          </div>

          <div 
            id="output-container" 
            className="bg-[var(--primary-black)]/60 p-6 rounded-xl border border-[var(--accent-teal)]/20 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            <ReactMarkdown
              className="prose prose-invert prose-headings:text-[var(--accent-teal)] prose-strong:text-white/90 prose-li:marker:text-[var(--accent-teal)] max-w-none"
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

          <div className="flex flex-wrap justify-between gap-4 mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--primary-black)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
            >
              <FaArrowLeft className="text-[var(--accent-teal)]" />
              <span>Back</span>
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--primary-black)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2 relative"
              >
                {copySuccess ? (
                  <>
                    <FaCheckCircle className="text-green-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="text-[var(--accent-teal)]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleShowAnswer}
                className="px-6 py-3 bg-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--primary-black)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
              >
                <IoDocumentTextOutline className="text-[var(--accent-teal)]" />
                <span>{showAnswers ? "Hide Answers" : "Show Answers"}</span>
              </button>
            </div>
          </div>
        </div>
        
        {showAnswers && (
          <div ref={answerRef} className="mt-8">
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
