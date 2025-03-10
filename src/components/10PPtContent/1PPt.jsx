import { useState } from "react";
import img5 from "../../assets/inputimages/img7.jpg";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import APIService from "../API";
import { useNavigate } from "react-router";

import HomeButton from "../HomeButton";

const PPt = () => {
  const [loading, setLoading] = useState(false);
  const [pptcontent, setpptcontent] = useState("");
  const [warning, setWarning] = useState(false);
  const [Topic, setTopic] = useState("");
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    const slidenumber = e.target[1].value;
    setTopic(topic);

    if (!topic) {
      setWarning(true);
      return;
    }

    const prompt = `Generate appropriate slide title and bullet points for a slide preparing proferrional style presentation on following topic. Total ${slidenumber} slides covering key concepts, main topics and relevant examples.
Topic-  ${topic}

When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.
For date: ${date} and time: ${time}(dont display it in output)
`;

    setLoading(true);
    APIService({ question: prompt, onResponse: handleOnResponse });
  };

  const handleOnResponse = (response) => {
    try {
      const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        setpptcontent(content);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("Failed to generate pptcontent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (pptcontent) {
      navigator.clipboard
        .writeText(pptcontent)
        .then(() => {
          alert("Copied to clipboard successfully.");
        })
        .catch(() => {
          alert("Failed to copy to clipboard.");
        });
    } else {
      alert("There is no pptcontent content to copy.");
    }
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
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
        pdf.save(`PPt Content of ${Topic}.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-3 flex flex-col lg:flex-row justify-center items-center gap-8">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 h-auto flex justify-center">
        <img
          src={img5}
          alt="Career Guidance"
          className="w-full h-70 sm:w-2/3 md:w-1/2 lg:w-2/3 sm:h-48 md:h-56 lg:h-auto flex justify-center object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="max-w-2xl w-full p-3 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
        <h2
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          PPT Content Generator
        </h2>
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleEnterPressed}
          className="space-y-6"
        >
          {/* Topic Entry */}
          <div className="space-y-2">
            <label
              htmlFor="topicEntry"
              className="block text-lg font-medium text-white"
            >
              Enter full Topic
            </label>
            <input
              type="text"
              id="topicEntry"
              name="topicEntry"
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="AI : foe or friend ?, Climate Change"
            />
          </div>

          {/* Slides Count Entry */}
          <div className="space-y-2">
            <label
              htmlFor="slidesEntry"
              className="block text-lg font-medium text-white"
            >
              Enter Slides Count (up to 15)
            </label>
            <input
              type="number"
              id="slidesEntry"
              name="slidesEntry"
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="e.g., 2"
              min="1"
              max="15"
            />
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-info hover:bg-black transition-all transform hover:scale-105"
            >
              Generate
            </button>
          </div>
        </form>

        {/* Loading Spinner */}
        {loading ? (
          <div className="mt-6 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          pptcontent && (
            <>
              <div id="output-container" className="mt-6">
                <ReactMarkdown
                  className="w-full p-3 rounded-lg bg-secondary text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  children={pptcontent}
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="btn btn-dark p-3 rounded-lg bg-accent hover:bg-black text-white transition-all"
                  onClick={handleCopyToClipboard}
                >
                  Copy to clipboard
                </button>
                <button
                  className="btn btn-secondary p-3 rounded-lg bg-gray-600 hover:bg-black text-white transition-all"
                  onClick={handleDownloadPdf}
                >
                  Download pdf
                </button>
              </div>
            </>
          )
        )}

        {/* Home Button */}
        <div className="mt-6">
          <HomeButton />
        </div>

        {/* Warning Alert */}
        {warning && (
          <div
            className="mt-6 p-4 bg-teal-600 text-black border border-red-800 rounded-lg flex justify-center text-lg"
            role="alert"
          >
            Please enter a topic to generate a card!
          </div>
        )}
      </div>
    </div>
  );
};

export default PPt;
