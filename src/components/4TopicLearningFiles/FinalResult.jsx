import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown"; // Add this import
import HomeButton from "../HomeButton";
import { IoArrowBack, IoDocumentTextOutline, IoInformationCircleOutline, IoRepeat } from "react-icons/io5";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinalResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) {
    navigate("/topic-learning");
    return null;
  }
  const { userAnswers, correctAnswers, questions, topic, level } =
    location.state;
  const top = topic;
  const lev = level;

  const [selectedDescription, setSelectedDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState({});
  const [retakeQuiz, setRetakeQuiz] = useState(false);
  const retakeQuizRef = useRef(null);
  const retakemcqs = useRef("");
  const explanationRef = useRef(null); // Ref to the explanation section

  const calculateScore = () => {
    let score = 0;
    Object.keys(userAnswers).forEach((key) => {
      if (userAnswers[key] === correctAnswers[key]) {
        score += 1;
      }
    });
    return score;
  };

  const handleDescriptionFetch = async (questionKey, question, correctAnswer) => {
    setLoadingQuestions((prev) => ({ ...prev, [questionKey]: true }));
    setSelectedDescription(null);

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
        setTimeout(
          () => explanationRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      },
    });
  };

  const score = calculateScore();
  const totalQuestions = Object.keys(correctAnswers).length;
  const incorrectAnswers = totalQuestions - score;
  const percentage = Math.round((score / totalQuestions) * 100);

  const data = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [score, incorrectAnswers],
        backgroundColor: ["rgba(46, 213, 197, 0.8)", "rgba(139, 92, 246, 0.8)"],
        borderColor: ["rgba(46, 213, 197, 1)", "rgba(139, 92, 246, 1)"],
        borderWidth: 1,
        hoverBackgroundColor: ["rgba(46, 213, 197, 1)", "rgba(139, 92, 246, 1)"],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          font: {
            size: 14
          }
        }
      }
    }
  };

  const handleReTakeQuiz = () => {
    setRetakeQuiz(!retakeQuiz);
    if (!retakeQuiz) {
      setTimeout(
        () => retakeQuizRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  };

  const handleStartQuizClick = (event) => {
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
  };

  const handleDownloadPdf = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const input = document.getElementById("result-container");
      
      // Create a temporary container with white background
      const tempContainer = document.createElement("div");
      tempContainer.style.width = "800px";
      tempContainer.style.padding = "40px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.color = "#000000";
      
      // Clone the content
      const contentClone = input.cloneNode(true);
      
      // Adjust styles for PDF
      const headings = contentClone.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        heading.style.color = "#000000";
      });
      
      const tables = contentClone.querySelectorAll('table');
      tables.forEach(table => {
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        
        const cells = table.querySelectorAll('th, td');
        cells.forEach(cell => {
          cell.style.border = "1px solid #dddddd";
          cell.style.padding = "8px";
          cell.style.color = "#000000";
        });
        
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
          header.style.backgroundColor = "#f2f2f2";
          header.style.color = "#000000";
        });
      });
      
      tempContainer.appendChild(contentClone);
      document.body.appendChild(tempContainer);

      // Create PDF
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      // Remove temporary container
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${topic}_Quiz_Result.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/topic-learning");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 md:py-10 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10" id="result-container">
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBack}
              className="text-[var(--accent-teal)] hover:text-white transition-colors flex items-center gap-2"
            >
              <IoArrowBack size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Quiz Results
            </h1>
            <button
              onClick={handleDownloadPdf}
              disabled={loading}
              className="text-[var(--accent-teal)] hover:text-white transition-colors flex items-center gap-2"
            >
              <IoDocumentTextOutline size={20} />
              <span>{loading ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl text-white mb-2">Topic: <span className="font-semibold">{topic}</span></h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)]"></div>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Chart */}
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-white">
              Performance Summary
            </h2>
            <div className="w-full max-w-xs mx-auto">
              <Pie data={data} options={chartOptions} />
            </div>
          </div>
          
          {/* Score Details */}
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-white">
              Score Details
            </h2>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)]">
                {percentage}%
              </div>
              <p className="text-lg text-gray-300">
                You scored {score} out of {totalQuestions} questions
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-[var(--accent-teal)]/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-[var(--accent-teal)]">{score}</div>
                <div className="text-sm text-gray-300">Correct</div>
              </div>
              <div className="p-3 bg-[var(--primary-violet)]/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-[var(--primary-violet)]">{incorrectAnswers}</div>
                <div className="text-sm text-gray-300">Incorrect</div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReTakeQuiz}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <IoRepeat size={20} />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Retake Quiz Form */}
        {retakeQuiz && (
          <div 
            ref={retakeQuizRef}
            className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-white">
              Retake Quiz
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full sm:w-auto">
                <label htmlFor="numMCQs" className="block text-sm font-medium text-gray-300 mb-2">
                  Number of MCQs (max 10)
                </label>
                <input
                  type="number"
                  id="numMCQs"
                  ref={retakemcqs}
                  defaultValue="5"
                  min="1"
                  max="10"
                  className="w-full sm:w-32 p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={handleStartQuizClick}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg hover:opacity-90 transition-all mt-6 sm:mt-0"
              >
                Start New Quiz
              </button>
            </div>
          </div>
        )}
        
        {/* Detailed Evaluation */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          <h2 className="text-xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-white">
            Detailed Evaluation
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--primary-black)]/60 border-b border-[var(--accent-teal)]/20">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Question</th>
                  <th className="px-4 py-3 text-left">Your Answer</th>
                  <th className="px-4 py-3 text-left">Correct Answer</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(questions).map((key, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-[var(--primary-black)]/40 ${
                      index % 2 === 0 ? 'bg-[var(--primary-black)]/20' : 'bg-[var(--primary-black)]/40'
                    }`}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{questions[key]}</td>
                    <td className={`px-4 py-3 ${
                      userAnswers[key] === correctAnswers[key]
                        ? "text-[var(--accent-teal)]"
                        : "text-red-400"
                    }`}>
                      {userAnswers[key] || "No Answer"}
                    </td>
                    <td className="px-4 py-3 text-[var(--accent-teal)]">{correctAnswers[key]}</td>
                    <td className="px-4 py-3">
                      {userAnswers[key] === correctAnswers[key] ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-teal)]/20 text-[var(--accent-teal)]">
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400/20 text-red-400">
                          Incorrect
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleDescriptionFetch(
                            key,
                            questions[key],
                            correctAnswers[key]
                          )
                        }
                        disabled={loadingQuestions[key]}
                        className="px-3 py-1 bg-[var(--primary-black)]/60 text-[var(--accent-teal)] rounded flex items-center gap-1 text-sm hover:bg-[var(--primary-black)]/80 transition-all"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Explanation Section */}
        {selectedDescription && (
          <div 
            ref={explanationRef}
            className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-white">
              Explanation
            </h2>
            <div className="prose prose-invert max-w-none prose-headings:text-[var(--accent-teal)] prose-a:text-[var(--accent-teal)] prose-strong:text-white">
              <ReactMarkdown>{selectedDescription}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default FinalResult;
