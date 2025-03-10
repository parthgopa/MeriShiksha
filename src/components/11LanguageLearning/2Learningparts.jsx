import React, { useState, useEffect, useRef } from "react";
import APIService from "../API"; // Assuming you have an API service to handle it
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown"; // Add this import
import LoadingSpinner from "../LoadingSpinner"; // Import the LoadingSpinner component
import { useSpeechSynthesis } from "react-speech-kit"; // Import useSpeechSynthesis
import HomeButton from "../HomeButton";

import { HiMiniStop } from "react-icons/hi2";
import { PiSpeakerHighFill } from "react-icons/pi";
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

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();

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

    return () => cancel();
  }, [initialPrompt, currentPart]);

  //   const handleNext = async () => {
  //     if (currentPart < parts) {
  //       cancel(); // Stop speech immediately when moving to the next part

  //       const nextPart = currentPart + 1;

  //       if (cacheRef.current[nextPart]) {
  //         setResponse(cacheRef.current[nextPart].response);
  //         setCurrentPart(nextPart);
  //         setLoading(false);
  //       } else {
  //         setLoading(true); // Start spinner when making API call

  //         let newPrompt = "";
  //         if (nextPart === 2) {
  //           newPrompt = `I'm learning ${language} language. I'm a complete beginner.

  //           2. Vocabulary:
  //     What are the 100 (or specify a number) most common words in ${language} and their meanings in English?
  //     Provide examples of how to use these words in simple sentences.
  //     What are some effective methods for memorizing vocabulary in  ${language}?
  // `;
  //         } else if (nextPart === 3) {
  //           newPrompt = `Having learned the fundamentals of topic:'${topic}' ${
  //             subject && `incontext of subject :'${subject}'`
  //           }, I am ready for Part 3. Provide an overview of the advanced concepts and applications of :${topic}, explaining how it is applied in real-world scenarios and its impact on related fields.
  //           Content Type - knowledge-based.
  //           When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.For date: ${date} and time: ${time}(dont display it in output)`;
  //         } else if (nextPart === 4) {
  //           newPrompt = `I have completed Parts 1 to 3 of topic:'${topic}' ${
  //             subject && `incontext of subject :'${subject}'`
  //           }. For Part 4, provide content on the current trends, contemporary issues, and recent developments in :${topic}. Include challenges, innovations, and the evolving role of ${subject} in society.
  //           Content Type - knowledge-based.
  //           When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.For date: ${date} and time: ${time}(dont display it in output)`;
  //         } else if (nextPart === 5) {
  //           newPrompt = `With Parts 1 to 4 of topic:'${topic}' ${
  //             subject && `incontext of subject :'${subject}'`
  //           } complete, please provide content for Part 5 that explores the future prospects of :${topic}, potential career paths, and upcoming advancements. Highlight opportunities for further learning and professional growth in this field.
  //           Content Type - knowledge-based.
  //           When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.For date: ${date} and time: ${time}(dont display it in output)
  //           `;
  //         }

  //         // console.log(newPrompt);

  //         await APIService({
  //           question: newPrompt,
  //           onResponse: (response) => handleOnResponse(nextPart, response),
  //         });

  //         setCurrentPart(nextPart);
  //       }
  //     }
  //   };

  const handleFinish = () => {
    cancel(); // Stop speech when finishing
    setShowQuitPopup(true);
  };
  const confirmQuit = () => {
    navigate("/language-learning");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response).then(() => {
      alert("Copied to clipboard successfully.");
    });
  };

  const handleSpeak = () => {
    if (currentSpeechResponse) {
      speak({ text: currentSpeechResponse, rate: speechRate });
    }
  };
  const handleStop = () => {
    cancel();
  };

  const handleDownloadPdf = async () => {
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
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
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
    <div
      className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex flex-col items-center"
      id="container"
    >
      <div className="w-full max-w-4xl bg-gradient-to-r from-secondary via-60% to-black from-65% p-2 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold text-white mb-4">
            {language} Language Part - {currentPart}
          </h4>
          {supported && (
            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                className="btn btn-info px-4 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleSpeak}
              >
                {speaking ? "Speaking..." : <PiSpeakerHighFill />}
              </button>
              <button
                className="btn btn-info px-4 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleStop}
              >
                <HiMiniStop />
              </button>
              <label className="flex items-center gap-2">
                Speed:
                <input
                  className="w-32 rounded-lg bg-secondary text-white focus:ring-2 focus:ring-accent focus:outline-none"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => {
                    setSpeechRate(parseFloat(e.target.value));
                    if (speaking) {
                      cancel();
                      speak({
                        text: currentSpeechResponse,
                        rate: parseFloat(e.target.value),
                      });
                    }
                  }}
                />
              </label>
              <span className="text-white font-medium">{speechRate}</span>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner /> // Render spinner when loading
        ) : (
          <>
            <div
              id="output-container"
              className="p-2 rounded-lg bg-secondary text-white"
            >
              <ReactMarkdown
                className="max-w-auto text-white"
                children={response}
              />
            </div>
            <div
              className="flex flex-wrap justify-center gap-4 mt-6"
              id="buttonGroup"
            >
              {/* <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handlePrevious}
                disabled={currentPart === 1 || loading}
              >
                Previous
              </button> */}
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleNext}
                disabled={currentPart === parts || loading}
              >
                Next
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleQuiz}
                disabled={currentPart === parts || loading}
              >
                Part - {currentPart} Quiz
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleFinish}
                disabled={currentPart === parts || loading}
              >
                Finish
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleCopyToClipboard}
              >
                Copy to Clipboard
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleDownloadPdf}
              >
                Download Pdf
              </button>
            </div>
          </>
        )}
        {/* Quit Confirmation Popup */}
        {showQuitPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-300 p-4 rounded-md text-center text-black">
              <p>Are you sure you want to quit?</p>
              <div className="mt-3 flex justify-center gap-4">
                <button
                  onClick={confirmQuit}
                  className="btn btn-dark px-4 py-2 text-white rounded-md"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowQuitPopup(false)}
                  className="btn btn-success px-4 py-2 rounded-md"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <HomeButton className="mt-6 btn btn-accent px-6 py-2 rounded-lg" />
      </div>
    </div>
  );
};

export default LearningParts;
