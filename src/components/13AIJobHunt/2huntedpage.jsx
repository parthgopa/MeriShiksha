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
      alert("Copied to clipboard successfully.");
    });
  };

  const handleDownloadPdf = async () => {
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
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-2 justify-center items-center">
      <form className="max-w-2xl mx-auto p-3 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black">
        <h3
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Job Hunt
        </h3>
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div
                id="output-container"
                className="p-2 rounded-lg border border-gray-800 text-white overflow-auto max-h-96"
              >
                <ReactMarkdown
                  className="max-w-auto text-white h-96 overflow-auto"
                  children={summary}
                />
              </div>
            </>
          )}
        </div>
        <HomeButton />
      </form>
      <div className="flex justify-between gap-4">
        <button
          className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
          onClick={() => {
            // Ensure form data persists when navigating back
            if (location.state?.formData) {
              localStorage.setItem('jobHuntFormData', JSON.stringify(location.state.formData));
            }
            navigate(-1);
          }}
        >
          Back
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
          onClick={handleCopyToClipboard}
        >
          Copy to Clipboard
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-cardaccent transition-all transform hover:scale-105"
          onClick={handleDownloadPdf}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default HuntedPage;
