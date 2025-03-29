import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown"; // Add this import
import HomeButton from "../HomeButton";
import { IoArrowForward } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaQuestionCircle } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const LanguageResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) {
    navigate("/topic-learning");
    return null;
  }
  const { userAnswers, correctAnswers, questions, currentPart, language } =
    location.state;

  const [selectedDescription, setSelectedDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retakeQuiz, setRetakeQuiz] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("Download PDF");
  const retakeQuizRef = useRef(null);
  const retakemcqs = useRef("");
  const explanationRef = useRef(null); // Ref to the explanation section
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const calculateScore = () => {
    let score = 0;
    Object.keys(userAnswers).forEach((key) => {
      if (userAnswers[key] === correctAnswers[key]) {
        score += 1;
      }
    });
    return score;
  };

  const handleDescriptionFetch = async (question, correctAnswer) => {
    setLoading(true);
    setSelectedDescription(null);

    const prompt = `
      For the following question and its answer, provide a clear and concise explanation for why the correct answer is correct (if possible then give an example). Keep the explanation short and to the point.

      Question: ${question}
      Correct Answer: ${correctAnswer}.
    `;

    await APIService({
      question: prompt,
      onResponse: (response) => {
        if (response.error) {
          setSelectedDescription(response.error);
        } else {
          setSelectedDescription(
            response["candidates"][0]["content"]["parts"][0]["text"]
          );
        }
        setLoading(false);
        // Scroll to the explanation section once the description is fetched
        setTimeout(
          () => explanationRef.current.scrollIntoView({ behavior: "smooth" }),
          100
        );
      },
    });
  };

  const score = calculateScore();
  const totalQuestions = Object.keys(correctAnswers).length;
  const incorrectAnswers = totalQuestions - score;
  const percentage = Math.round((score / totalQuestions) * 100);

  const data = {
    labels: ["Correct Answers", "Wrong Answers"],
    datasets: [
      {
        data: [score, incorrectAnswers],
        backgroundColor: ["rgba(0, 201, 167, 0.8)", "rgba(255, 99, 132, 0.8)"],
        hoverBackgroundColor: ["rgba(0, 201, 167, 1)", "rgba(255, 99, 132, 1)"],
        borderColor: ["rgba(0, 201, 167, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: {
            size: 14
          }
        }
      }
    }
  };

  const handleNextPart = () => {
    let nextPart = currentPart + 1;
    let parts = 7;

    let newPrompt = "";
    if (nextPart === 2) {
      newPrompt = `I'm learning ${language} language. I'm a complete beginner.
          
2. Basic vocabulary  :
    Start with the most common and useful words in ${language}. Create 
flashcards with pictures and their corresponding 
words. Practice saying them out loud and using them 
in simple sentences. For example, 'gato' means 'cat' in 
Spanish. 'El gato es negro' means 'The cat is black'
    For date: ${date} and time: ${time}(dont display it in output)
`;
    } else if (nextPart === 3) {
      newPrompt = `I'm learning ${language} language. I'm a complete beginner.
          
3. Basic Grammer  :
     Provide the basic grammar rules of ${language} such as noun genders, 
verb conjugations, and sentence structures. Use online resources or grammar books to understand 
these rules. For instance, in Spanish, nouns have 
genders, and adjectives must agree with the noun in gender and number.
For date: ${date} and time: ${time}(dont display it in output)
`;
    } else if (nextPart === 4) {
      newPrompt = `I'm learning ${language} language. I'm a complete beginner.
          
4.  Basic Sentence Structure:
      Provide forming simple sentences using the vocabulary and grammar 
of the language: ${language}: .Start with subject-verb-object (SVO) 
structure. For example, in Spanish, 'Yo como 
manzanas' follows the SVO structure
For date: ${date} and time: ${time}(dont display it in output)
`;
    } else if (nextPart === 5) {
      newPrompt = `I'm learning ${language} language. I'm a complete beginner.
          
5.  Reading Simple Texts :
      Provide simple sentences using the vocabulary and grammar 
of the language: ${language} . Format of sentence should be-> subject-verb-object (SVO) 
structure. For example, in Spanish, 'Yo como 
manzanas' follows the SVO structure
For date: ${date} and time: ${time}(dont display it in output)
`;
    } else if (nextPart === 6) {
      newPrompt = `I'm learning ${language} language. I'm a complete beginner.
          
6.  Writing Simple Sentences :
       write simple 
sentences and short paragraphs in [language] using 
the vocabulary and grammar of the language: ${language} . For 
example, write about your daily routine in Spanish: 'Me 
despierto a las siete de la mañana. Desayuno y luego 
voy al trabajo.
For date: ${date} and time: ${time}(dont display it in output)
`;
    } else if (nextPart === 7) {
      newPrompt = `I'm learning ${language} language. I'm a complete beginner.
          
7.  Basic Conversations :
        Provide a basic conversation of two friends in ${language}.
Use common phrases and questions. For example, in 
Spanish, you can start a conversation with 'Hola! 
¿Cómo estás?' (Hello! How are you?).
For date: ${date} and time: ${time}(dont display it in output)
`;
    }

    let data2 = {
      initialpart: nextPart,
      language: language,
      parts: parts,
      initialPrompt: newPrompt,
    };
    if (newPrompt && language && parts && nextPart)
      navigate("/learning-parts", { state: data2 });
  };

  const handleStartQuizClick = (event) => {
    setLoading(false);
    event.preventDefault(); // Prevent form submission
    let retakeMCQs = retakemcqs.current.value;
    if (retakeMCQs) {
      const data = {
        numMCQs: retakeMCQs,
        comingfrom: "RetakeMCQs",
      };
      navigate("/mcq-test", { state: data });
    } else {
      alert("Specify number of MCQs to Generate");
    }
  };
  
  const handleDownloadPdf = async () => {
    setDownloadStatus("Preparing PDF...");
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const input = document.getElementById("Container");

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
        pdf.save(`${language}_Quiz_Results.pdf`);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden" id="Container">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            {language} Quiz Results
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-[var(--primary-black)]/40 rounded-full border border-[var(--accent-teal)]/20">
            <span className="text-teal-100 mr-2">Part</span>
            <span className="text-white font-bold text-xl">{currentPart}</span>
          </div>
        </div>

        {/* Score Summary and Chart */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Score Summary */}
            <div className="w-full md:w-1/2 text-center space-y-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                  Your Score
                </h2>
                <div className="flex items-center justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-[var(--primary-black)]/60" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="text-[var(--accent-teal)]" 
                        strokeWidth="10" 
                        strokeDasharray={`${percentage * 2.51} 251`} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{percentage}%</span>
                      <span className="text-xs text-teal-100">{score}/{totalQuestions}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--accent-teal)]">{score}</div>
                  <div className="text-sm text-teal-100">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{incorrectAnswers}</div>
                  <div className="text-sm text-teal-100">Incorrect</div>
                </div>
              </div>
            </div>
            
            {/* Pie Chart */}
            <div className="w-full md:w-1/2 max-w-xs mx-auto">
              <Pie data={data} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Evaluation Table */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
            Detailed Evaluation
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--accent-teal)]/20">
                  <th className="px-4 py-3 text-left text-teal-100">#</th>
                  <th className="px-4 py-3 text-left text-teal-100">Question</th>
                  <th className="px-4 py-3 text-left text-teal-100">Your Answer</th>
                  <th className="px-4 py-3 text-left text-teal-100">Correct Answer</th>
                  <th className="px-4 py-3 text-left text-teal-100">Status</th>
                  <th className="px-4 py-3 text-left text-teal-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(questions).map((key, index) => (
                  <tr key={index} className="border-b border-[var(--primary-violet)]/10 hover:bg-[var(--primary-black)]/40 transition-colors">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{questions[key]}</td>
                    <td className={`px-4 py-3 ${
                      userAnswers[key] === correctAnswers[key]
                        ? "text-[var(--accent-teal)]"
                        : "text-red-400"
                    }`}>
                      {userAnswers[key] || "No Answer"}
                    </td>
                    <td className="px-4 py-3 text-[var(--accent-teal)]">{correctAnswers[key]}</td>
                    <td className="px-4 py-3">
                      {userAnswers[key] === correctAnswers[key] ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-teal)]/20 text-[var(--accent-teal)]">
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          Incorrect
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {userAnswers[key] !== correctAnswers[key] && (
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-sm transition-all hover:scale-105 flex items-center text-sm"
                          onClick={() =>
                            handleDescriptionFetch(
                              questions[key], // The question
                              correctAnswers[key] // The correct answer
                            )
                          }
                        >
                          <FaQuestionCircle className="mr-1" />
                          Explain
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Description */}
        {(loading || selectedDescription) && (
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-8" ref={explanationRef}>
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
              Explanation
            </h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <LoadingSpinner />
                <p className="mt-4 text-teal-100">Generating explanation...</p>
              </div>
            ) : (
              <div className="p-6 bg-[var(--primary-black)]/40 rounded-lg border border-[var(--accent-teal)]/20">
                <ReactMarkdown
                  className="prose prose-invert max-w-none"
                  children={selectedDescription}
                />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
            onClick={handleNextPart}
          >
            <span className="mr-2">Continue to Next Part</span>
            <IoArrowForward />
          </button>
          
          <button
            className="px-6 py-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
            onClick={handleDownloadPdf}
          >
            <IoDocumentTextOutline className="mr-2" />
            <span>{downloadStatus}</span>
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

export default LanguageResult;
