import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import HomeButton from "../HomeButton";

// Cache key for localStorage
const CACHE_KEY = 'jobHuntResponses';

const HuntedPage = () => {
  const [summary, setSummary] = useState("none");
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState("Copy to Clipboard");
  const [downloadStatus, setDownloadStatus] = useState("Download PDF");
  const navigate = useNavigate();
  const location = useLocation(null);
  const { initialPrompt } = location.state;

  // Function to get response from cache
  const getFromCache = (prompt) => {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      return cache[prompt];
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  // Function to save response to cache
  const saveToCache = (prompt, data) => {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      cache[prompt] = data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Function to format the response data into markdown
  const formatResponse = (data) => {
    try {
      let formattedMarkdown = `#\n`;
      
      data.companies.forEach((company, index) => {
        formattedMarkdown += `## ${index + 1}. ${company.name}\n\n`;
        formattedMarkdown += `🏢 **Location:** ${company.address}\n\n`;
        formattedMarkdown += `🔗 **Apply Here:** [Click to Apply](${company.link})\n\n`;
        formattedMarkdown += `---\n\n`;
      });

      return formattedMarkdown;
    } catch (error) {
      console.error("Error formatting response:", error);
      return "Error formatting the job listings. Please try again.";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Check cache first
      const cachedData = getFromCache(initialPrompt);
      if (cachedData) {
        console.log('Using cached response');
        setSummary(formatResponse(cachedData));
        setLoading(false);
        return;
      }

      // If not in cache, make API call
      console.log('Making new API call');
      await APIService({
        question: initialPrompt,
        onResponse: handleOnResponse,
      });
    };

    fetchData();
  }, [initialPrompt]);

  const handleOnResponse = (response) => {
    try {
      let responseText = response["candidates"][0]["content"]["parts"][0]["text"];
      // Clean the response text
      responseText = responseText.slice(7, responseText.length - 4);
      
      // Parse the JSON data
      const parsedData = JSON.parse(responseText);
      
      // Save to cache
      saveToCache(initialPrompt, parsedData);
      
      // Format and display
      setSummary(formatResponse(parsedData));
      setLoading(false);
    } catch (error) {
      console.error("Error processing response:", error);
      setSummary("Error processing the job listings. Please try again.");
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy to Clipboard"), 2000);
    });
  };

  const handleDownloadPdf = async () => {
    setDownloadStatus("Preparing PDF...");
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const input = document.getElementById("output-container");
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdfWidth = canvas.width * 0.75;
        const pdfHeight = canvas.height * 0.75;

        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`JOB HUNT.pdf`);
        setDownloadStatus("Downloaded!");
        setTimeout(() => setDownloadStatus("Download PDF"), 2000);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
        setDownloadStatus("Download Failed");
        setTimeout(() => setDownloadStatus("Download PDF"), 2000);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Job Hunt Results
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Here are the job opportunities that match your profile
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <LoadingSpinner />
              <p className="mt-4 text-teal-100">Finding the best job matches for you...</p>
            </div>
          ) : (
            <>
              <div
                id="output-container"
                className="p-6 rounded-lg bg-[var(--primary-black)]/40 border border-[var(--accent-teal)]/20 text-white overflow-auto max-h-[60vh] markdown-content"
              >
                <ReactMarkdown
                  className="text-white"
                  children={summary}
                />
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            className="px-6 py-3 bg-gradient-to-r from-[var(--primary-black)] to-[var(--primary-violet)]/70 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
            onClick={() => {
              // Ensure form data persists when navigating back
              if (location.state?.formData) {
                localStorage.setItem('jobHuntFormData', JSON.stringify(location.state.formData));
              }
              navigate(-1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
              onClick={handleCopyToClipboard}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copyStatus}
            </button>
            
            <button
              className="px-6 py-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
              onClick={handleDownloadPdf}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {downloadStatus}
            </button>
          </div>
        </div>
      </div>

      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default HuntedPage;
