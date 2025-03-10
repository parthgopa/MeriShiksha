import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import HomeButton from "../HomeButton";

const PlannedPage = () => {
  const [plan, setplan] = useState("none");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, topic, time } = location.state;
  const date = new Date().toDateString();
  const Time = new Date().toTimeString();

  useEffect(() => {
    let prompt = `I want to learn the following topic so design a lesson plan for  learning following topic in ${time}.
Subject- ${subject} 
Topic - ${topic}, 
Prepare brief note based on provided subject, example of topic and also prepare dot point note for my exam time reading. 
For date: ${date} and time: ${Time}(dont display it in output)`;

    const fetchMCQs = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [topic, subject]);

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
        pdf.save(`Lesson Plan.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 justify-center items-center">
      <form className="max-w-2xl mx-auto p-2 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black">
        <h5
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Plan of : {subject} & Topic-{topic}
        </h5>
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner /> // Render spinner when loading
          ) : (
            <div
              id="output-container"
              className="p-2 rounded-lg bg-secondary text-white"
            >
              <ReactMarkdown
                className="max-w-auto text-white"
                children={plan}
              />
            </div>
          )}
        </div>
      </form>
      <div className="flex justify-between gap-4 ">
        <button
          className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
          onClick={() => {
            // Keep the form data in localStorage when navigating back
            const formData = { subject, topic, time };
            localStorage.setItem('lessonFormData', JSON.stringify(formData));
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
      <HomeButton />
    </div>
  );
};
export default PlannedPage;
