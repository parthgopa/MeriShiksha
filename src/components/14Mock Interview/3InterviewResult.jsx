import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import HomeButton from "../HomeButton";
import { IoDocumentTextOutline, IoArrowBack } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

/**
 * Interview Result Component
 * Displays the analysis of the mock interview and provides PDF download functionality
 */
const InterviewResult = () => {
  const location = useLocation(null);
  const navigate = useNavigate();
  const { analysis, totalTime, questionTimes } = location.state || {};
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("Download PDF Report");

  /**
   * Formats time in seconds to a readable string
   */
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }, []);

  /**
   * Handles PDF generation and download
   */
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setDownloadStatus("Generating PDF...");

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      // Get the content container
      const content = document.getElementById("pdf-content");
      
      // Create a temporary container with white background
      const tempContainer = document.createElement("div");
      tempContainer.style.width = "800px";
      tempContainer.style.padding = "40px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.color = "#000000";
      
      // Clone the content
      const contentClone = content.cloneNode(true);
      
      // Convert markdown content to plain text
      const markdownElements = contentClone.getElementsByClassName("prose");
      for (let element of markdownElements) {
        element.style.color = "#000000";
      }
      
      tempContainer.appendChild(contentClone);
      document.body.appendChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF({
        unit: "px",
        format: "a4",
        orientation: "portrait"
      });

      // Generate canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Add image to PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Interview_Analysis.pdf");
      
      setDownloadStatus("Downloaded!");
      setTimeout(() => setDownloadStatus("Download PDF Report"), 2000);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setDownloadStatus("Download Failed");
      setTimeout(() => setDownloadStatus("Download PDF Report"), 2000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleBack = () => {
    navigate("/mock-interview");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBack}
              className="mr-4 text-[var(--accent-teal)] hover:text-white transition-colors"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Interview Analysis Report
            </h1>
          </div>
          
          {/* Interview Duration */}
          {totalTime && (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="px-6 py-3 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20 flex items-center gap-2">
                <FaRegClock className="text-[var(--accent-teal)] text-xl" />
                <span className="text-lg">Total Interview Duration: <span className="font-semibold text-white">{formatTime(totalTime)}</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Question Response Times */}
        {questionTimes && questionTimes.length > 0 && (
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
              Response Times
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionTimes.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 hover:border-[var(--accent-teal)]/40 transition-all">
                  <div className="font-medium text-[var(--accent-teal)] mb-2">Question {index + 1}</div>
                  <div className="text-sm text-gray-300 mb-3 line-clamp-2">{item.question}</div>
                  <div className="flex items-center gap-2 text-white">
                    <FaRegClock className="text-[var(--accent-teal)]" />
                    <span className="font-semibold">{formatTime(item.timeSpent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Content */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
            Detailed Analysis
          </h2>
          <div id="pdf-content" className="p-6 rounded-xl bg-[var(--primary-black)]/40 border border-[var(--accent-teal)]/20">
            <div className="prose prose-invert max-w-none prose-headings:text-[var(--accent-teal)] prose-strong:text-white prose-li:marker:text-[var(--accent-teal)]">
              <ReactMarkdown>{analysis || "No analysis data available."}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 mb-6">
          <button
            className={`px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:opacity-90 flex items-center gap-2 ${
              isGeneratingPdf ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {downloadStatus}
              </>
            ) : (
              <>
                <IoDocumentTextOutline className="text-xl" />
                {downloadStatus}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default InterviewResult;
