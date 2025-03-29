import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import { FaArrowLeft, FaCopy, FaDownload, FaCheckCircle } from "react-icons/fa";

const QandAsecondPage = () => {
  const [questionSections, setQuestionSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, topic, prompt } = location.state;

  useEffect(() => {
    const APIcall = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    APIcall();
  }, [topic, subject, prompt]);

  const parseQuestionTypes = (text) => {
    // Define the question types to look for
    const questionTypes = [
      "very short",
      "short",
      "long",
      "true/false",
      "fill in the blanks",
    ];

    // Initialize an object to store different sections
    let sections = {};

    // Split the text into lines
    const lines = text.split('\n');
    let currentType = null;
    let currentContent = [];

    // Process each line
    lines.forEach((line) => {
      // Check if this line indicates a new question type
      const typeMatch = questionTypes.find(type => 
        line.toLowerCase().includes(type) && line.match(/^\d+\.|\*|Question/i)
      );

      if (typeMatch) {
        // If we were collecting content for a previous type, save it
        if (currentType) {
          sections[currentType] = currentContent.join('\n');
        }
        // Start new section
        currentType = typeMatch;
        currentContent = [line];
      } else if (currentType && line.trim()) {
        // Add line to current section
        currentContent.push(line);
      }
    });

    // Save the last section
    if (currentType && currentContent.length > 0) {
      sections[currentType] = currentContent.join('\n');
    }

    return sections;
  };

  const handleOnResponse = (response) => {
    try {
      const fullText = response["candidates"][0]["content"]["parts"][0]["text"];
      const sections = parseQuestionTypes(fullText);
      setQuestionSections(sections);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    const fullText = Object.values(questionSections).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const input = document.getElementById("output-container");
      
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdfWidth = canvas.width * 0.75;
      const pdfHeight = canvas.height * 0.75;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "pt",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Q&A - ${topic}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF: ", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const formatSectionTitle = (type) => {
    return type
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' Questions';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Materials on Topic - {topic} & subject - {subject}
            </h2>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">Subject:</span> {subject}
            </div>
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">Topic:</span> {topic}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner />
              <p className="mt-4 text-lg animate-pulse">Generating your questions and answers...</p>
            </div>
          ) : (
            <>
              <div
                id="output-container"
                className="bg-[var(--primary-black)]/60 p-6 rounded-xl border border-[var(--accent-teal)]/20 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar"
              >
                {Object.entries(questionSections).length > 0 ? (
                  Object.entries(questionSections).map(([type, content], index) => (
                    <div key={index} className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-[var(--accent-teal)] border-b border-[var(--accent-teal)]/20 pb-2">
                        {formatSectionTitle(type)}
                      </h3>
                      <ReactMarkdown 
                        className="prose prose-invert prose-headings:text-[var(--accent-teal)] prose-strong:text-white/90 prose-li:marker:text-[var(--accent-teal)] max-w-none"
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No question sections were identified. Please try again with different parameters.</p>
                  </div>
                )}
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
                    onClick={handleCopyToClipboard}
                    className="px-6 py-3 bg-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--primary-black)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                    disabled={Object.keys(questionSections).length === 0}
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
                    onClick={handleDownloadPdf}
                    className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                    disabled={downloadingPdf || Object.keys(questionSections).length === 0}
                  >
                    <FaDownload />
                    <span>{downloadingPdf ? "Generating PDF..." : "Download PDF"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default QandAsecondPage;
