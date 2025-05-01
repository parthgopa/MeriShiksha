import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import HomeButton from "../HomeButton";
import { useAuth } from "../../context/AuthContext";
import SubscriptionCheck from "../Subscription/SubscriptionCheck";
import { FaCopy } from "react-icons/fa";

const AICarrierGuidance = () => {
  const [plan, setPlan] = useState("none");
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = location.state || { language: "English" };
  const date = new Date().toDateString();
  const time = new Date().toTimeString();
  const { currentUser } = useAuth();

  const fetchCareerGuidance = async () => {
    if (loading) { // Prevent multiple simultaneous calls
      let prompt = `"Provide an overview of AI career opportunities in India, including 
chip-level, fundamental model, and application segments. Include 
latest government initiatives, career maps for the next 10 years, 
free/paid learning resources, and in-demand AI jobs.

Please provide the latest information on the above in ${language} language.
Prepare your proper report which proper advice on the subject for date: ${date} and time: ${time}(dont display it in output)`;
      
      try {
        await APIService({ question: prompt, onResponse: handleOnResponse });
      } catch (error) {
        console.error("Error calling API service:", error);
        setLoading(false);
      }
    }
  };
  
  // Use effect to fetch career guidance once subscription is confirmed
  useEffect(() => {
    // Only fetch if subscription is confirmed and we're still in loading state
    if (hasSubscription && loading) {
      console.log('Subscription confirmed, fetching career guidance...');
      fetchCareerGuidance();
    }
  }, [hasSubscription]); // Remove loading from dependencies to prevent continuous calls

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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(plan);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadPdf = () => {
    setDownloadStarted(true);
    
    import('jspdf').then(({ default: jsPDF }) => {
      import('html2canvas').then(({ default: html2canvas }) => {
        try {
          const contentElement = document.getElementById('ai-career-content');
          if (!contentElement) {
            console.error("Content element not found");
            setDownloadStarted(false);
            return;
          }
          
          // Create PDF with A4 dimensions
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 15; // margin in mm
          
          // Add header
          pdf.setFontSize(18);
          pdf.setTextColor(23, 162, 184); // Teal color
          pdf.text('AI Career Opportunities', pageWidth / 2, margin, { align: 'center' });
          
          // Add date
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100); // Gray
          pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, margin + 10);
          
          // Add line
          pdf.setDrawColor(23, 162, 184); // Teal
          pdf.line(margin, margin + 15, pageWidth - margin, margin + 15);
          
          // Convert content to canvas
          html2canvas(contentElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          }).then(canvas => {
            // Calculate the number of pages needed
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = margin + 20; // Start position after header
            
            // Add first page
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - position - margin);
            
            // Add subsequent pages if needed
            while (heightLeft > 0) {
              position = margin;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', margin, position - imgHeight + heightLeft, imgWidth, imgHeight);
              heightLeft -= (pageHeight - margin * 2);
            }
            
            // Add footer to all pages
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              pdf.setPage(i);
              pdf.setFontSize(8);
              pdf.setTextColor(100, 100, 100);
              pdf.text(`Page ${i} of ${pageCount} | MeriShiksha AI Career Guidance`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
            
            // Save the PDF
            pdf.save(`AI_Career_Opportunities_${language}_${new Date().toISOString().slice(0, 10)}.pdf`);
            setDownloadStarted(false);
          });
        } catch (error) {
          console.error("Error generating PDF:", error);
          setDownloadStarted(false);
        }
      });
    });
  };

  const handleSubscriptionSuccess = () => {
    console.log('Subscription check succeeded, user has API calls available');
    setHasSubscription(true);
  };

  const handleSubscriptionError = (error) => {
    console.error("Subscription check error:", error.message);
    setLoading(false);
  };

  return (
    <SubscriptionCheck
      onSuccess={handleSubscriptionSuccess}
      onError={handleSubscriptionError}
      checkOnMount={true}
    >
      <div className="min-h-screen w-screen bg-[var(--primary-black)] text-white py-16 px-4">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            <span className="text-[var(--accent-teal)]">AI Career</span> Guidance
          </h1>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              AI Career Opportunities
            </h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Comprehensive guide to AI career paths in India
            </p>
          </div>

          {/* Content Section */}
          <div className="mt-8 bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl border border-[var(--accent-teal)]/20 relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-[var(--accent-teal)]">Generating AI Career Guidance...</p>
                {!hasSubscription && currentUser && (
                  <p className="mt-2 text-sm text-[var(--accent-teal)]/70">Checking subscription status...</p>
                )}
              </div>
            ) : (
              <div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={handleCopyToClipboard}
                    className="p-2 bg-[var(--primary-violet)]/30 hover:bg-[var(--primary-violet)]/50 rounded-lg transition-all duration-300"
                    title="Copy to clipboard"
                  >
                    <FaCopy className="text-[var(--accent-teal)]" />
                  </button>
                  {copySuccess && (
                    <span className="absolute -top-8 right-0 text-sm bg-[var(--accent-teal)] text-[var(--primary-black)] px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </div>
                <div id="ai-career-content" className="prose prose-invert max-w-none prose-headings:text-[var(--accent-teal)] prose-a:text-[var(--accent-teal)]">
                  {plan === "none" ? (
                    <p>No content generated yet. Please wait while we prepare your career guidance.</p>
                  ) : (
                    <ReactMarkdown>{plan}</ReactMarkdown>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons - Only show when not loading */}
          {!loading && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleCopyToClipboard}
                className="px-6 py-3 bg-[var(--primary-black)] border border-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center space-x-2"
              >
                {copySuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-2" />
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
    </SubscriptionCheck>
  );
};

export default AICarrierGuidance;
