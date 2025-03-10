import { useState } from "react";
import img1 from "../../assets/inputimages/img5.jpg";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import APIService from "../API";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const Flashcards = () => {
  const [loading, setLoading] = useState(false);
  const [flashcard, setflashcard] = useState("");
  const [warning, setWarning] = useState(false);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target.topicEntry.value.trim();

    if (!topic) {
      setWarning(true);
      return;
    }

    const prompt = `Create comprehensive Flash cards(in detail) on the topic: ${topic}. Include:

- Key points and important definitions
- Relevant case laws and judicial pronouncements (if topic is related to law)
- Analytical explanations and examples
- Questions on one side and answers on the other

Use clear and concise language, and organize the content in a logical and structured manner.When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.
For date: ${date} and time: ${time}(dont display it in output)`;

    setLoading(true);
    APIService({ question: prompt, onResponse: handleOnResponse });
  };

  const handleOnResponse = (response) => {
    try {
      const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        setflashcard(content);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (flashcard) {
      navigator.clipboard
        .writeText(flashcard)
        .then(() => {
          alert("Copied to clipboard successfully.");
        })
        .catch(() => {
          alert("Failed to copy to clipboard.");
        });
    } else {
      alert("There is no flashcard content to copy.");
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
        pdf.save(`Flash Card.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-6 flex flex-col lg:flex-row justify-center items-center gap-8">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 h-auto flex justify-center">
        <img
          src={img1}
          alt="Career Guidance"
          className="w-full h-70 sm:w-2/3 md:w-1/2 lg:w-2/3 sm:h-48 md:h-56 lg:h-auto flex justify-center object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="max-w-2xl w-full p-2 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
        <h2
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Flash Card
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
              Specify the Topic
            </label>
            <input
              type="text"
              id="topicEntry"
              name="topicEntry"
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="Springs, graphics, etc"
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
          <div className="flex justify-center items-center mt-6">
            <LoadingSpinner />
          </div>
        ) : (
          flashcard && (
            <>
              <div
                id="output-container"
                className="mt-6 p-3 bg-secondary rounded-lg"
              >
                <ReactMarkdown
                  className="text-white whitespace-pre-wrap"
                  children={flashcard}
                />
              </div>
              <div className="flex space-x-4 mt-6 justify-center">
                <button
                  className="btn btn-dark hover:bg-gray-700 transition-all transform hover:scale-105"
                  onClick={handleCopyToClipboard}
                >
                  Copy to clipboard
                </button>
                <button
                  className="btn btn-secondary hover:bg-gray-600 transition-all transform hover:scale-105"
                  onClick={handleDownloadPdf}
                >
                  Download pdf
                </button>
              </div>
            </>
          )
        )}

        {/* Warning Alert */}
        {warning && (
          <div
            className="mt-6 p-4 bg-teal-600 text-black border border-red-800 rounded-lg items-center justify-center flex text-xl"
            role="alert"
          >
            Please enter a topic to generate a card!
          </div>
        )}

        {/* Home Button */}
        <div className="mt-6">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
