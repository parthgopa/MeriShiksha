import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import { Button } from "react-bootstrap";

const QandAsecondPage = () => {
  const [questionSections, setQuestionSections] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, topic, prompt } = location.state;

  useEffect(() => {
    const APIcall = async () => {
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    APIcall();
  }, [topic, subject]);

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
    navigator.clipboard.writeText(fullText).then(() => {
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
        pdf.save(`Q and A of ${topic}.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  const formatSectionTitle = (type) => {
    return type
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' Questions';
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-4 flex justify-center items-center">
      <form className="max-w-2xl mx-auto p-2 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black">
        <div className="space-y-4">
          <h5
            className="text-2xl font-bold text-center mb-6 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Materials on Topic - {topic} & subject - {subject}
          </h5>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div
                id="output-container"
                className="p-2 rounded-lg bg-secondary text-white"
              >
                {Object.entries(questionSections).map(([type, content], index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-bold mb-3 text-accent">
                      {formatSectionTitle(type)}
                    </h3>
                    <ReactMarkdown className="prose prose-invert">
                      {content}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
              <div className="flex justify-between gap-4">
                <Button
                  className="rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <div className="flex gap-4">
                  <Button
                    className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
                    onClick={handleCopyToClipboard}
                  >
                    Copy
                  </Button>
                  <Button
                    className="px-6 py-2 rounded-lg bg-dark text-white hover:bg-accent transition-all transform hover:scale-105"
                    onClick={handleDownloadPdf}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default QandAsecondPage;
