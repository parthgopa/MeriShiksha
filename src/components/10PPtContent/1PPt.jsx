import { useState } from "react";
import img5 from "../../assets/inputimages/img7.jpg";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import APIService from "../API";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import { IoDocumentTextOutline, IoClipboardOutline } from "react-icons/io5";

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
      handleSubmit(e);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (!pptcontent) {
      alert("Please generate PPT content first.");
      return;
    }
    
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      
      const input = document.getElementById("output-container");
      
      // Create a temporary container with white background
      const tempContainer = document.createElement("div");
      tempContainer.style.width = "800px";
      tempContainer.style.padding = "40px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.color = "#000000";
      
      // Clone the content
      const contentClone = input.cloneNode(true);
      
      // Adjust styles for PDF
      const markdownContent = contentClone.querySelector('.markdown-content');
      if (markdownContent) {
        markdownContent.style.color = "#000000";
      }
      
      tempContainer.appendChild(contentClone);
      document.body.appendChild(tempContainer);

      // Create PDF
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      // Remove temporary container
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PPT_Content_${Topic}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF: ", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 md:py-10 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row justify-center items-center gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={img5}
              alt="PPT Content Generator"
              className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
            />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="w-full lg:w-2/3 max-w-2xl">
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              PPT Content Generator
            </h1>
            
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
                  Enter Full Topic
                </label>
                <input
                  type="text"
                  id="topicEntry"
                  name="topicEntry"
                  className="w-full p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                  placeholder="AI: foe or friend?, Climate Change"
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
                  className="w-full p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                  placeholder="e.g., 5"
                  min="1"
                  max="15"
                  defaultValue="5"
                />
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-medium"
                >
                  Generate PPT Content
                </button>
              </div>
            </form>

            {/* Warning Alert */}
            {warning && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-600 rounded-lg text-center text-white">
                Please enter a topic to generate PPT content!
              </div>
            )}
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            pptcontent && (
              <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
                <div
                  id="output-container"
                  className="mb-6"
                >
                  <div className="prose prose-invert max-w-none prose-headings:text-[var(--accent-teal)] prose-a:text-[var(--accent-teal)] prose-strong:text-white markdown-content">
                    <ReactMarkdown>{pptcontent}</ReactMarkdown>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    className="px-6 py-3 bg-[var(--primary-black)]/60 text-white rounded-lg flex items-center gap-2 hover:bg-[var(--primary-black)]/80 transition-all border border-[var(--accent-teal)]/20"
                    onClick={handleCopyToClipboard}
                  >
                    <IoClipboardOutline size={20} />
                    <span>Copy to clipboard</span>
                  </button>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-all"
                    onClick={handleDownloadPdf}
                  >
                    <IoDocumentTextOutline size={20} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default PPt;
