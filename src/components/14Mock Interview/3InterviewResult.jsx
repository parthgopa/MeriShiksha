import React, { useCallback, useState } from "react";
import { useLocation } from "react-router";
import ReactMarkdown from "react-markdown";
import HomeButton from "../HomeButton";

/**
 * Interview Result Component
 * Displays the analysis of the mock interview and provides PDF download functionality
 */
const InterviewResult = () => {
  const location = useLocation(null);
  const { analysis, totalTime, questionTimes } = location.state || {};
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white">
      <div className="max-w-4xl mx-auto p-3">
        {/* Header */}
        <div className="bg-secondary/30 rounded-xl p-3 mb-8">
          <h1 className="text-4xl text-white font-bold mb-4 text-center bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Interview Analysis Report
          </h1>
          
          {/* Interview Duration */}
          {totalTime && (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-secondary/50 p-3 rounded-lg text-lg text-white">
                Total Interview Duration: {formatTime(totalTime)}
              </div>
            </div>
          )}

          {/* Question Response Times */}
          {questionTimes && questionTimes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-center">Response Times</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionTimes.map((item, index) => (
                  <div key={index} className="bg-secondary/20 p-4 rounded-lg">
                    <div className="font-medium text-gray-300 mb-2">Question {index + 1}</div>
                    <div className="text-sm text-gray-400 mb-2">{item.question}</div>
                    <div className="text-lg font-semibold text-blue-400">
                      Time: {formatTime(item.timeSpent)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Content */}
          <div id="pdf-content" className="bg-secondary/20 p-3 rounded-lg">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{analysis || "No analysis data available."}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105 flex items-center gap-2 ${
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
                Generating PDF...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF Report
              </>
            )}
          </button>
        </div> */}

        {/* Home Button */}
        <div className="mt-6">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
