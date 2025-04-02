import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import { FaDownload, FaArrowLeft, FaCopy } from "react-icons/fa";

const PlannedPage = () => {
  const [lessonPlan, setLessonPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, topic, time } = location.state;

  useEffect(() => {
    const prompt = `Generate a detailed lesson plan for the subject "${subject}" and topic "${topic}" for a duration of "${time}". The lesson plan should include the following sections:
    1. Learning Objectives: Clear, measurable objectives that students should achieve by the end of the lesson.
    2. Prerequisites: Any prior knowledge or skills students should have.
    3. Materials Needed: List of resources, tools, or materials required.
    4. Introduction (5-10 minutes): An engaging hook to capture students' interest.
    5. Main Content (Bulk of the lesson): Detailed explanation of the topic, broken down into logical segments.
    6. Activities: Interactive exercises or discussions to reinforce learning.
    7. Assessment: Methods to evaluate student understanding.
    8. Conclusion: Summary of key points and preview of future lessons.
    9. Homework/Extension: Optional activities for further learning.
    
    Format the lesson plan in a clear, organized manner with proper headings and bullet points where appropriate. Make it comprehensive yet concise, suitable for a teacher to follow easily.`;

    const APIcall = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    APIcall();
  }, [topic, subject, time]);

  const handleOnResponse = (response) => {
    try {
      const lessonPlanText = response["candidates"][0]["content"]["parts"][0]["text"];
      setLessonPlan(lessonPlanText);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(lessonPlan);
    alert("Lesson plan copied to clipboard!");
  };

  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const input = document.getElementById("lesson-plan-container");
    
    // Show loading state
    const downloadBtn = document.getElementById("download-btn");
    if (downloadBtn) {
      downloadBtn.innerText = "Generating PDF...";
      downloadBtn.disabled = true;
    }
    
    try {
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
      pdf.save(`Lesson Plan - ${topic}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF: ", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Reset button state
      if (downloadBtn) {
        downloadBtn.innerText = "Download PDF";
        downloadBtn.disabled = false;
      }
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Lesson Plan: {topic}
          </h2>
          
          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">Subject:</span> {subject}
            </div>
            <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-[var(--accent-teal)]">Duration:</span> {time}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
              <p className="ml-4 text-lg animate-pulse">Crafting your lesson plan...</p>
            </div>
          ) : (
            <>
              <div 
                id="lesson-plan-container" 
                className="bg-[var(--primary-black)]/60 p-6 rounded-xl border border-[var(--accent-teal)]/20 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar"
              >
                <ReactMarkdown className="prose prose-invert prose-headings:text-[var(--accent-teal)] prose-strong:text-white/90 prose-li:marker:text-[var(--accent-teal)] max-w-none">
                  {lessonPlan}
                </ReactMarkdown>
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
                  >
                    <FaCopy className="text-[var(--accent-teal)]" />
                    <span>Copy</span>
                  </button>
                  
                  <button
                    id="download-btn"
                    onClick={handleDownloadPdf}
                    className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                  >
                    <FaDownload />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Home Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default PlannedPage;
