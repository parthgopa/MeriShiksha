import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import HomeButton from "../HomeButton";
import { IoArrowBack, IoDocumentText, IoClipboard } from "react-icons/io5";

const LabReport = () => {
  const [plan, setplan] = useState("none");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { topic, method } = location.state;
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  useEffect(() => {
    let prompt = `I have certain research plan on specific subject. Before commenting research process in laboratory I want your lab assistant services by making simulation through AI tool. You are my virtual lab assistant, make virtual simulations for the following research.  topic of the research - " ${topic}" and method of chemical process: "${method}"
As my visual lab assistant help me to complete lab simulation of my above project.
Prepare your Lab report in following format 
Subject
Material 
Instruments 
Step by step process 
Observation 
Calculations
Output
Safety measurement. For date: ${date} and time: ${time}(dont display it in output)`;

    const fetchMCQs = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [topic, method]);

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
    navigator.clipboard.writeText(plan).then(() => {
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
        const pdfWidth = canvas.width * 0.75; // Convert pixels to points
        const pdfHeight = canvas.height * 0.75; // Convert pixels to points

        // Create the PDF document with custom dimensions
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Report of ${topic}.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Lab Report: {topic}
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Detailed procedure and observations for your experiment
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <LoadingSpinner />
              <p className="mt-4 text-teal-100">Generating your lab report...</p>
            </div>
          ) : (
            <div
              id="output-container"
              className="p-6 bg-[var(--primary-black)]/40 rounded-lg border border-[var(--accent-teal)]/20 overflow-auto max-h-[60vh]"
            >
              <ReactMarkdown
                className="prose prose-invert max-w-none"
                children={plan}
              />
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 mt-8">
          <button
            className="px-6 py-3 bg-gradient-to-r from-[var(--primary-black)] to-[var(--primary-violet)]/70 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <IoArrowBack className="mr-2" />
            <span>Back to Lab Assistant</span>
          </button>
          
          <button
            className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
            onClick={handleCopyToClipboard}
          >
            <IoClipboard className="mr-2" />
            <span>Copy to Clipboard</span>
          </button>
          
          <button
            className="px-6 py-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
            onClick={handleDownloadPdf}
          >
            <IoDocumentText className="mr-2" />
            <span>Download PDF</span>
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
export default LabReport;
