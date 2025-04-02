import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import HomeButton from "../HomeButton";

const AICarrierGuidance = () => {
  const [plan, setplan] = useState("none");
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(null);
  const { language } = location.state;
  const date = new Date().toDateString();
  const Time = new Date().toTimeString();

  useEffect(() => {
    let prompt = `"Provide an overview of AI career opportunities in India, including 
chip-level, fundamental model, and application segments. Include 
latest government initiatives, career maps for the next 10 years, 
free/paid learning resources, and in-demand AI jobs.

Please provide the latest information on the above in ${language} language.
Prepare your  proper report which proper advice on the subjectFor date: ${date} and time: ${Time}(dont display it in output)`;

    const fetchMCQs = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, []);

  const handleOnResponse = (response) => {
    try {
      setplan(response["candidates"][0]["content"]["parts"][0]["text"]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(plan);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleDownloadPdf = async () => {
    setDownloadStarted(true);
    try {
      const { default: jsPDF } = await import("jspdf");
  
      const doc = new jsPDF();
  
      // Example: Extracting text from a div
      const content = document.getElementById("output-container")?.innerText || "No content available.";
  
      // Add text to PDF (proper formatting for multiple lines)
      const marginLeft = 10;
      const marginTop = 10;
      const maxWidth = 180; // Width constraint
      doc.text(content, marginLeft, marginTop, { maxWidth });
  
      // Save the PDF
      doc.save("AI_Career_Guidance.pdf");
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setDownloadStarted(false);
    }
  };
  

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            AI Career Opportunities
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Comprehensive guide to AI career paths in India
          </p>
        </div>

        {/* Output Container */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm overflow-hidden mb-8">
          {/* Output Header */}
          <div className="bg-gradient-to-r from-[var(--primary-black)] to-[var(--primary-violet)]/40 p-6 border-b border-[var(--accent-teal)]/20">
            <h2 className="text-2xl font-bold text-white">Career Guide in {language}</h2>
          </div>
          
          {/* Loading or Content */}
          {loading ? (
            <div className="flex justify-center items-center p-20">
              <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-teal-100">Generating your AI career guide...</p>
              </div>
            </div>
          ) : (
            <div 
              id="output-container" 
              className="p-6 md:p-8 bg-[var(--primary-black)]/50 rounded-b-xl text-white overflow-auto max-h-[60vh] custom-scrollbar"
            >
              <ReactMarkdown 
                children={plan} 
                className="prose prose-invert prose-headings:text-[var(--accent-teal)] prose-a:text-[var(--accent-teal)] prose-strong:text-white prose-li:marker:text-[var(--accent-teal)] max-w-none"
              />
            </div>
          )}
          
          {/* Action Buttons - Only show when not loading */}
          {!loading && (
            <div className="p-6 border-t border-[var(--accent-teal)]/20 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>
              
              <button
                onClick={handleCopyToClipboard}
                disabled={copySuccess}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 disabled:opacity-70 flex items-center justify-center space-x-2 group"
              >
                {copySuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownloadPdf}
                disabled={downloadStarted}
                className="px-6 py-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {downloadStarted ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Preparing PDF...</span>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Additional Resources Section - Only show when not loading */}
        {!loading && (
          <div className="mt-8 bg-gradient-to-br from-[var(--primary-black)]/60 to-[var(--primary-violet)]/10 p-6 rounded-xl border border-[var(--accent-teal)]/10">
            <h3 className="text-xl font-bold mb-4 text-[var(--accent-teal)]">Additional Resources</h3>
            <ul className="space-y-3 text-white">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--accent-teal)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Visit <a href="https://www.aicte-india.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-teal)] underline">AICTE</a> for official AI curriculum and guidelines</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--accent-teal)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Explore free AI courses on platforms like Coursera, edX, and NPTEL</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--accent-teal)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Join AI communities like INAI (Intel AI) and NASSCOM's AI initiatives</span>
              </li>
            </ul>
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

export default AICarrierGuidance;
