import React, { useState, useEffect, useRef } from "react";
import APIService from "../API"; // Assuming you have an API service to handle it
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown"; // Add this import
import LoadingSpinner from "../LoadingSpinner"; // Import the LoadingSpinner component
// import { useSpeechSynthesis } from "react-speech-kit"; // Import useSpeechSynthesis
import Speech from 'react-speech';
import HomeButton from "../HomeButton";

import { HiMiniStop } from "react-icons/hi2";
import { PiSpeakerHighFill } from "react-icons/pi";
import { IoArrowForward } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaClipboard } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";

const LearningParts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialpart, language, parts, initialPrompt } = location.state;

  const [currentPart, setCurrentPart] = useState(initialpart);
  const [response, setResponse] = useState(initialPrompt);
  const [loading, setLoading] = useState(false); // Add loading state
  const [speechRate, setSpeechRate] = useState(1); // State for speech rate
  const cacheRef = useRef({}); // Cache object to store responses
  const [currentSpeechResponse, setSpeechResponse] = useState("");
  const date = new Date().toDateString();
  const time = new Date().toTimeString();
  const [showQuitPopup, setShowQuitPopup] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState("Copy to Clipboard");
  const [downloadStatus, setDownloadStatus] = useState("Download PDF");

  const handleOnResponse = (part, response) => {
    const responseText =
      response["candidates"][0]["content"]["parts"][0]["text"];

    // Slicing hashtage from speech text.
    let SpeechResponse = responseText.slice(3, responseText.length);
    setSpeechResponse(SpeechResponse);

    // Add trademark of www.merishiksha.com....
    const FinalResponseText = responseText + "\n \t by www.merishiksha.com\n\n";
    setResponse(FinalResponseText);
    setLoading(false); // Stop spinner once response is received

    // Save response to cache
    cacheRef.current[part] = {
      prompt: part,
      response: responseText,
    };
  };

  useEffect(() => {
    const fetchInitialContent = async () => {
      setLoading(true); // Start spinner when making API call

      // Check cache for the initial part
      if (cacheRef.current[currentPart]) {
        setResponse(cacheRef.current[currentPart].response);
        setLoading(false);
      } else {
        await APIService({
          question: initialPrompt,
          onResponse: (response) => handleOnResponse(currentPart, response),
        });
      }
    };

    fetchInitialContent();

  }, [initialPrompt, currentPart]);

  const handleFinish = () => {
    cancel(); // Stop speech when finishing
    setShowQuitPopup(true);
  };
  
  const confirmQuit = () => {
    navigate("/language-learning");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy to Clipboard"), 2000);
    });
  };

  const handleSpeak = () => {
    if (currentPart && speechRef.current) {
      if (!isSpeaking) {
        setIsSpeaking(true);
        speechRef.current.play();
      }
    }
  };

  const handleStop = () => {
    if (isSpeaking && speechRef.current) {
      setIsSpeaking(false);
      speechRef.current.pause();
    }
  };

  // Custom style for Speech component
  const speechStyle = {
    play: {
      display: 'none', // Hide the default play button
    },
    stop: {
      display: 'none', // Hide the default stop button
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadStatus("Preparing PDF...");
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const input = document.getElementById("output-container");
    html2canvas(input, { scale: 2 }) // Reduce the scale from 5 to 2
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8); // Change to JPEG and lower quality
        const pdfWidth = canvas.width * 0.75; // Convert pixels to points
        const pdfHeight = canvas.height * 0.75; // Convert pixels to points

        // Create the PDF document with custom dimensions
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${language} Part -${currentPart}.pdf`);
        setDownloadStatus("Downloaded!");
        setTimeout(() => setDownloadStatus("Download PDF"), 2000);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
        setDownloadStatus("Download Failed");
        setTimeout(() => setDownloadStatus("Download PDF"), 2000);
      });
  };
  
  const handleQuiz = () => {
    let Prompt = "";
    const nextPart = currentPart + 1;
    let numMCQs = "5";
    let level = "intermediate";

    if (currentPart === 1) {
      Prompt = `I'm learning ${language} language.I had learned full Alphabets of it.

    Generate ${numMCQs} Randomized MCQs on Alphabets of ${language} language having level : ${level}. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}

`;
    } else if (currentPart === 2) {
      Prompt = `I'm learning ${language} language.I had learned basic vocabulary of it.

    Generate ${numMCQs} Randomized MCQs on basic vocabulary of ${language} language having level : ${level}. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}`;
    } else if (currentPart === 3) {
      Prompt = `I'm learning ${language} language.I had learned basic Grammer of it.

    Generate ${numMCQs} Randomized MCQs on basic Grammer of ${language} language having level : ${level}. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}`;
    } else if (currentPart === 4) {
      Prompt = `I'm learning ${language} language.I had learned Basic Sentence Structure  of it.

    Generate ${numMCQs} Randomized MCQs on Basic Sentence Structure  of ${language} language having level : ${level}. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}`;
    } else if (currentPart === 5) {
      Prompt = `I'm learning ${language} language.I had learned  Reading Simple Texts of it.

    Generate ${numMCQs} Randomized MCQs on  Reading Simple Texts of ${language} language having level : ${level}. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}`;
    } else if (currentPart === 6) {
      Prompt = `I'm learning ${language} language.I had learned  Writing Simple Sentences  of it.

    Generate ${numMCQs} Randomized MCQs on  Writing Simple Sentences  of ${language} language having level : ${level}. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}`;
    } else if (currentPart === 7) {
      Prompt = `I'm learning ${language} language.I had learned Basic Conversations  of it.

    Generate ${numMCQs} Randomized MCQs on Basic Conversations of ${language} language having level : ${level}. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}`;
    }
    // console.log(Prompt);

    let data = {
      language: language,
      currentPart: currentPart,
      quizprompt: Prompt,
    };
    navigate("/language-quiz", { state: data });
  };

  const handleNext = async () => {
    if (currentPart < parts) {
      cancel(); // Stop speech immediately when moving to the next part

      const nextPart = currentPart + 1;

      if (cacheRef.current[nextPart]) {
        setResponse(cacheRef.current[nextPart].response);
        setCurrentPart(nextPart);
        setLoading(false);
      } else {
        setLoading(true); // Start spinner when making API call

        let newPrompt = "";
        if (nextPart === 2) {
          newPrompt = `I'm learning ${language} language. I'm a complete beginner.
          
2. Basic vocabulary  :
    Start with the most common and useful words in ${language}. Create 
flashcards with pictures and their corresponding 
words. Practice saying them out loud and using them 
in simple sentences. For example, 'gato' means 'cat' in 
Spanish. 'El gato es negro' means 'The cat is black'
    For date: ${date} and time: ${time}(dont display it in output)`;
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
        await APIService({
          question: newPrompt,
          onResponse: (response) => handleOnResponse(nextPart, response),
        });

        setCurrentPart(nextPart);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              {language} Language Learning
            </h1>
            <div className="flex items-center justify-center">
              <div className="px-4 py-1 bg-[var(--primary-black)]/40 rounded-full border border-[var(--accent-teal)]/20 inline-flex items-center">
                <span className="text-teal-100 mr-2">Part</span>
                <span className="text-white font-bold text-xl">{currentPart}</span>
                <span className="text-teal-100 mx-2">of</span>
                <span className="text-white font-bold text-xl">{parts}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <button
              className="px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg shadow-md transition-all hover:scale-105 flex items-center"
              onClick={handleSpeak}
            >
              <PiSpeakerHighFill className="mr-2" />
              {isSpeaking ? "Speaking..." : "Speak"}
            </button>
            
            <button
              className="px-4 py-2 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] rounded-lg shadow-md transition-all hover:scale-105 flex items-center"
              onClick={handleStop}
            >
              <HiMiniStop className="mr-2" />
              Stop
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-black)]/40 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-teal-100">Speed:</span>
              <input
                className="w-32 h-2 bg-[var(--primary-black)]/60 rounded-lg appearance-none cursor-pointer accent-[var(--accent-teal)]"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => {
                  const newRate = parseFloat(e.target.value);
                  setSpeechRate(newRate);
                  if (isSpeaking) {
                    handleStop();
                    // Small timeout to ensure stop completes before starting again
                    setTimeout(() => {
                      handleSpeak();
                    }, 100);
                  }
                }}
              />
              <span className="text-white font-medium">{speechRate}x</span>
            </div>
            
            {/* Hidden Speech component controlled via ref */}
            <div style={{ display: 'none' }}>
              <Speech
                ref={speechRef}
                text={currentSpeechResponse}
                pitch={1}
                rate={speechRate}
                volume={1}
                lang="en-US"
                voice="Google US English"
                style={speechStyle}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            <LoadingSpinner />
            <p className="mt-4 text-teal-100">Loading {language} content...</p>
          </div>
        ) : (
          <>
            <div
              id="output-container"
              className="p-6 rounded-xl bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 border border-[var(--accent-teal)]/10 backdrop-blur-sm text-white overflow-auto max-h-[60vh] markdown-content"
            >
              <ReactMarkdown
                className="prose prose-invert max-w-none"
                children={response}
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={currentPart === parts || loading}
              >
                <span className="mr-2">Next Part</span>
                <IoArrowForward />
              </button>
              
              <button
                className="px-6 py-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
                onClick={handleQuiz}
                disabled={currentPart === parts || loading}
              >
                <FaQuestionCircle className="mr-2" />
                <span>Take Quiz</span>
              </button>
              
              <button
                className="px-6 py-3 bg-gradient-to-r from-[var(--primary-black)] to-[var(--primary-violet)]/70 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
                onClick={handleFinish}
              >
                <IoMdExit className="mr-2" />
                <span>Finish</span>
              </button>
              
              <button
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
                onClick={handleCopyToClipboard}
              >
                <FaClipboard className="mr-2" />
                <span>{copyStatus}</span>
              </button>
              
              <button
                className="px-6 py-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
                onClick={handleDownloadPdf}
              >
                <IoDocumentTextOutline className="mr-2" />
                <span>{downloadStatus}</span>
              </button>
            </div>
          </>
        )}
        
        {/* Quit Confirmation Popup */}
        {showQuitPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gradient-to-br from-[var(--primary-black)] to-[var(--primary-violet)]/40 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/20 backdrop-blur-sm max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
                Quit Learning Session?
              </h3>
              <p className="text-teal-100 mb-6">
                Are you sure you want to exit this learning session? Your progress will be saved.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmQuit}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none"
                >
                  Yes, Exit
                </button>
                <button
                  onClick={() => setShowQuitPopup(false)}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Home Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default LearningParts;
