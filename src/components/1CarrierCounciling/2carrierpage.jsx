import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router";
import HomeButton from "../HomeButton";
import SubscriptionCheck from "../Subscription/SubscriptionCheck";
import APIService from "../API";

const CareerOutput = () => {
  const location = useLocation(null);
  const { interest, language } = location.state;
  const [copySuccess, setCopySuccess] = useState(false);
  const [plan, setPlan] = useState("none");
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(plan);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleDownloadPdf = async () => {
    setDownloadStarted(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const input = document.getElementById("output-container");
      
      const canvas = await html2canvas(input, { 
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
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
      pdf.save(`Career_Guidance.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF: ", err);
    } finally {
      setDownloadStarted(false);
    }
  };

  const processCareerGuidance = () => {
    setLoading(true);
    let prompt = `Based on my interest in ${interest}, suggest the top 5 career options that will be in demand after 4 years. Provide the following details for each career option:

- Career overview
- Key responsibilities
- Required skills and qualifications
- Relevant courses or certifications
- Name of reputed Indian colleges/institutes/universities with their website details

Consider factors like job market demand, growth prospects, and potential salary ranges. 
Provide the output in a concise bullet-point list format and in ${language} language.
For date: ${date} and time: ${time}(dont display it in output)`;
      console.log(prompt)
      try {
        APIService({ question: prompt, onResponse: handleOnResponse });
      } catch (error) {
        console.error("Error calling API service:", error);
        setLoading(false);
      }
    };

    const handleOnResponse = (response) => {
      try {
        if (response && response.candidates && response.candidates[0] && 
            response.candidates[0].content && response.candidates[0].content.parts && 
            response.candidates[0].content.parts[0]) {
          setPlan(response.candidates[0].content.parts[0].text);
        } else {
          console.error("Invalid response structure:", response);
          setPlan("Sorry, we couldn't generate a response. Please try again later.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching response:", error);
        setPlan("An error occurred while processing your request. Please try again later.");
        setLoading(false);
      }
    };

  return (
    <SubscriptionCheck onSuccess={processCareerGuidance}>
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Your Career Guidance
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Explore these career options tailored to your interests and skills
          </p>
        </div>

        {/* Output Container */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm overflow-hidden">
          {/* Output Header */}
          <div className="bg-gradient-to-r from-[var(--primary-black)] to-[var(--primary-violet)]/40 p-6 border-b border-[var(--accent-teal)]/20">
            <h2 className="text-2xl font-bold text-white">Career Recommendations</h2>
          </div>
          
          {/* Output Content */}
          <div 
            id="output-container" 
            className="p-6 md:p-8 bg-[var(--primary-black)]/50 rounded-b-xl text-white overflow-auto max-h-[60vh] custom-scrollbar"
          >
            <ReactMarkdown 
              children={plan} 
              className="prose prose-invert prose-headings:text-[var(--accent-teal)] prose-a:text-[var(--accent-teal)] prose-strong:text-white prose-li:marker:text-[var(--accent-teal)] max-w-none"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="p-6 border-t border-[var(--accent-teal)]/20 flex flex-col sm:flex-row justify-center gap-4">
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
        </div>
        
        {/* Additional Tips Section */}
        <div className="mt-12 bg-gradient-to-br from-[var(--primary-black)]/60 to-[var(--primary-violet)]/10 p-6 rounded-xl border border-[var(--accent-teal)]/10">
          <h3 className="text-xl font-bold mb-4 text-[var(--accent-teal)]">Next Steps</h3>
          <ul className="space-y-3 text-white">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--accent-teal)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Research each career option thoroughly to understand the day-to-day responsibilities</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--accent-teal)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Connect with professionals in your fields of interest for informational interviews</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--accent-teal)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Explore the suggested courses and certifications to build your skills</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
    </SubscriptionCheck>
  );
};

export default CareerOutput;
