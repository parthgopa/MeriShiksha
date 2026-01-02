import React, { useRef, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown"; 
import HomeButton from "../HomeButton";
import { IoArrowBack, IoDocumentTextOutline, IoInformationCircleOutline, IoRepeat } from "react-icons/io5";
import "./FinalResult.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinalResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) {
    navigate("/topic-learning");
    return null;
  }
  const { userAnswers, correctAnswers, questions, topic, level } = location.state;
  const top = topic;
  const lev = level;

  const [selectedDescription, setSelectedDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState({});
  const [retakeQuiz, setRetakeQuiz] = useState(false);
  const retakeQuizRef = useRef(null);
  const retakemcqs = useRef("");
  const explanationRef = useRef(null); 

  // Memoize score calculation
  const score = useMemo(() => {
    let s = 0;
    Object.keys(userAnswers).forEach((key) => {
      if (userAnswers[key] === correctAnswers[key]) {
        s += 1;
      }
    });
    return s;
  }, [userAnswers, correctAnswers]);

  const totalQuestions = useMemo(() => Object.keys(correctAnswers).length, [correctAnswers]);
  const incorrectAnswers = useMemo(() => totalQuestions - score, [totalQuestions, score]);
  const percentage = useMemo(() => Math.round((score / totalQuestions) * 100), [score, totalQuestions]);

  // Memoize handlers
  const handleDescriptionFetch = useCallback(async (questionKey, question, correctAnswer) => {
    setLoadingQuestions((prev) => ({ ...prev, [questionKey]: true }));
    setSelectedDescription(null);
    setLoading(true);
    const prompt = `
      For the following question and its answer, provide a clear and concise explanation for why the correct answer is correct (if possible then give an example). Keep the explanation short and to the point.

      Question: ${question}
      Correct Answer: ${correctAnswer}.
    `;
    await APIService({
      question: prompt,
      onResponse: (response) => {
        if (response.error) {
          setSelectedDescription(response.error);
        } else {
          setSelectedDescription(
            response["candidates"][0]["content"]["parts"][0]["text"]
          );
        }
        setLoadingQuestions((prev) => ({ ...prev, [questionKey]: false }));
        setLoading(false);
        setTimeout(() => explanationRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      },
    });
  }, []);

  const handleReTakeQuiz = useCallback(() => {
    setRetakeQuiz((prev) => !prev);
    if (!retakeQuiz) {
      setTimeout(() => retakeQuizRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [retakeQuiz]);

  const handleStartQuizClick = useCallback((event) => {
    event.preventDefault();
    let retakeMCQs = retakemcqs.current.value;
    if (retakeMCQs) {
      const data = {
        topic: top,
        level: lev,
        numMCQs: retakeMCQs,
        comingfrom: "RetakeMCQs",
      };
      navigate("/mcq-test", { state: data });
    } else {
      alert("Please specify the number of MCQs to generate");
    }
  }, [lev, navigate, top]);

  // Fast, attractive PDF download using jsPDF + autoTable (no pie chart)
  const handleDownloadPdf = useCallback(async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 15;
      let y = margin;

      // Title Section with colored background
      pdf.setFillColor(46, 213, 197);
      pdf.rect(0, y - 7, pdf.internal.pageSize.getWidth(), 14, 'F');
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${topic} - Quiz Result`, margin, y);
      y += 12;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Level: ${level || "-"}`, margin, y);
      y += 7;
      pdf.text(`Score: ${score} / ${totalQuestions} (${percentage}%)`, margin, y);
      y += 7;
      pdf.text(`Date: ${new Date().toLocaleString()}`, margin, y);
      y += 10;

      // Section Header for Table
      pdf.setFillColor(139, 92, 246);
      pdf.rect(0, y - 5, pdf.internal.pageSize.getWidth(), 10, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Quiz Answers Table', margin, y + 2);
      pdf.setTextColor(0, 0, 0);
      y += 10;

      // Prepare table data
      const tableHead = [["#", "Question", "Your Answer", "Correct Answer", "Status"]];
      const tableBody = Object.keys(questions).map((key, idx) => [
        idx + 1,
        questions[key],
        userAnswers[key] || "No Answer",
        correctAnswers[key],
        userAnswers[key] === correctAnswers[key] ? "Correct" : "Incorrect"
      ]);

      autoTable(pdf, {
        head: tableHead,
        body: tableBody,
        startY: y,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [46, 213, 197], textColor: 0, fontStyle: 'bold' },
        bodyStyles: { textColor: 20 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
          // Add header/footer if desired
        }
      });

      pdf.save(`${topic}_Quiz_Result.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF: ", err);
    } finally {
      setLoading(false);
    }
  }, [topic, level, score, totalQuestions, percentage, questions, userAnswers, correctAnswers]);

  const handleBack = useCallback(() => {
    navigate("/topic-learning");
  }, [navigate]);

  return (
    <div className="final-result-container">
      <div className="final-result-content" id="result-container">
        {/* Header */}
        <div className="final-result-header">
          <h1 className="final-result-title">
            Quiz Results
          </h1>
          <div className="text-center">
            <h2 className="text-xl text-white mb-2">Topic: <span className="font-semibold">{topic}</span></h2>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="final-result-score-section">
          <div className="final-result-score-grid">
            <div className="final-result-score-card">
              <div className="final-result-score-value final-result-score-percentage">
                {percentage}%
              </div>
              <div className="final-result-score-label">Overall Score</div>
            </div>
            <div className="final-result-score-card">
              <div className="final-result-score-value final-result-score-correct">
                {score}
              </div>
              <div className="final-result-score-label">Correct</div>
            </div>
            <div className="final-result-score-card">
              <div className="final-result-score-value final-result-score-incorrect">
                {incorrectAnswers}
              </div>
              <div className="final-result-score-label">Incorrect</div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons Section */}
        <div className="final-result-actions">
          <div className="final-result-actions-grid">
            <button
              onClick={handleDownloadPdf}
              disabled={loading}
              className="final-result-action-btn primary"
            >
              <IoDocumentTextOutline size={20} />
              <span>{loading ? "Generating PDF..." : "Download PDF"}</span>
            </button>
            <button
              onClick={handleBack}
              className="final-result-action-btn secondary"
            >
              <IoArrowBack size={20} />
              <span>Back to Topics</span>
            </button>
            <button
              onClick={handleReTakeQuiz}
              ref={retakeQuizRef}
              className="final-result-action-btn primary"
            >
              <IoRepeat size={20} />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
        
        {/* Retake Quiz Form */}
        {retakeQuiz && (
          <div className="final-result-actions">
            <div className="final-result-retake-section" ref={retakeQuizRef}>
              <div className="final-result-retake-title">
                Retake Quiz
              </div>
              <div className="final-result-retake-form">
                <input
                  type="number"
                  id="numMCQs"
                  ref={retakemcqs}
                  defaultValue="5"
                  min="1"
                  max="10"
                  placeholder="Number of MCQs (max 10)"
                  className="final-result-retake-input"
                />
                <button
                  onClick={handleStartQuizClick}
                  className="final-result-action-btn primary"
                >
                  Start New Quiz
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Detailed Evaluation */}
        <div className="final-result-questions-section">
          <h2 className="final-result-questions-title">
            Detailed Evaluation
          </h2>
          <div className="final-result-questions-list">
            {Object.keys(questions).map((key, index) => (
              <div 
                key={index} 
                className={`final-result-question-item ${
                  userAnswers[key] === correctAnswers[key] ? 'correct' : 'incorrect'
                }`}
              >
                <div className="final-result-question-header">
                  <div className="final-result-question-number">
                    {index + 1}
                  </div>
                  <div className="final-result-question-text">
                    {questions[key]}
                  </div>
                  <div className={`final-result-question-status ${
                    userAnswers[key] === correctAnswers[key] ? 'correct' : 'incorrect'
                  }`}>
                    {userAnswers[key] === correctAnswers[key] ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                </div>
                
                <div className="final-result-question-answers">
                  <div className="final-result-answer-row">
                    <span className="final-result-answer-label">Your Answer:</span>
                    <span className="final-result-answer-value">
                      {userAnswers[key] || "No Answer"}
                    </span>
                  </div>
                  <div className="final-result-answer-row">
                    <span className="final-result-answer-label">Correct:</span>
                    <span className="final-result-answer-value">
                      {correctAnswers[key]}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() =>
                    handleDescriptionFetch(
                      key,
                      questions[key],
                      correctAnswers[key]
                    )
                  }
                  disabled={loadingQuestions[key]}
                  className="final-result-explanation-btn"
                >
                  {loadingQuestions[key] ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <IoInformationCircleOutline size={16} />
                      <span>Explain</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Explanation Section */}
        {selectedDescription && (
          <div className="final-result-questions-section" ref={explanationRef}>
            <h2 className="final-result-questions-title">
              Explanation
            </h2>
            <div className="final-result-explanation">
              <div className="final-result-explanation-content">
                <ReactMarkdown>{selectedDescription}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Home Button */}
      <div className="final-result-home-btn">
        <HomeButton />
      </div>
    </div>
  );
};

export default FinalResult;
