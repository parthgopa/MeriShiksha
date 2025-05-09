import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import Speech from "react-speech";
import { PiMicrophoneDuotone, PiSpeakerHighFill } from "react-icons/pi";
import { HiMiniStop } from "react-icons/hi2";
import { IoClose, IoArrowBack, IoInformationCircle, IoCheckmarkCircle } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

import HomeButton from "../HomeButton";

const InterviewSimulation = () => {
  // State management for interview data and UI
  const [userResponse, setUserResponse] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState([]);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [currentSpeechResponse, setSpeechResponse] = useState("");
  const [questionTimer, setQuestionTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewTips, setInterviewTips] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSpeechModal, setShowSpeechModal] = useState(false);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  // Router hooks
  const location = useLocation(null);
  const navigate = useNavigate();

  // Extract interview context from location state
  const {
    FullName,
    educationQualifications,
    pastWorkExperience,
    currentWorkExperience,
    coreSkills,
    companyName,
    companyType,
    interviewPost,
    postNature,
    initialPrompt,
  } = location.state;

  // Interview assessment areas and prompts
  const prompts = {
    "Practical Knowledge": `Practical Knowledge.`,
    "My aptitude": `His Aptitude.`,
    "Managerial Ability": `Managerial Ability`,
    "Leadership and Aptitude Quality": `Leadership and Aptitude Quality`,
    "Communication Skill Set": `Communication Skill Set`,
    "Confidence Level": `Confidence Level`,
    "Psychometric Test": `Psychometric Test`,
    "Educational Background": `Educational Background and qualifications`,
  };

  // Determine assessment areas based on position nature
  const assessmentAreas = useMemo(() => {
    if (postNature === "Junior") {
      return [
        "Educational Background",
        "My aptitude",
        "Practical Knowledge",
        "Communication Skill Set",
        "Confidence Level"
      ];
    } else {
      return [
        "Practical Knowledge",
        "My aptitude",
        "Managerial Ability",
        "Leadership and Aptitude Quality",
        "Communication Skill Set",
        "Confidence Level",
        "Psychometric Test",
      ];
    }
  }, [postNature]);

  // Interview tips data
  const interviewTipsData = useMemo(
    () => [
      "🎯 Focus on clarity and conciseness in your responses",
      "🤝 Maintain professional tone throughout the interview",
      "📚 Use the STAR method for behavioral questions",
      "⏰ Take a moment to gather your thoughts before answering",
      "💡 Provide specific examples from your experience",
      "🔍 Show enthusiasm and interest in the role",
      "📝 Ask relevant questions when given the opportunity",
    ],
    []
  );

  // Initialize interview
  useEffect(() => {
    fetchNextQuestion(true);
    setIsInterviewStarted(true);
  }, []);

  // Initialize random interview tips
  useEffect(() => {
    const randomTips = interviewTipsData
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setInterviewTips(randomTips);
  }, [interviewTipsData]);

  // Question timer effect
  useEffect(() => {
    let interval;
    if (currentQuestion && !isLastQuestion) {
      setQuestionStartTime(Date.now());
      interval = setInterval(() => {
        setQuestionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentQuestion, isLastQuestion]);

  // Total interview timer effect
  useEffect(() => {
    let interval;
    if (isInterviewStarted && !isLastQuestion) {
      interval = setInterval(() => {
        setTotalTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, isLastQuestion]);

  // Format time helper function
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Generate question prompt
  const generateQuestionPrompt = useCallback(
    (assessmentArea) => {
      // For Junior positions, focus on education and aptitude
      if (postNature === "Junior") {
        return `Act as a ${companyName} company interviewer for a ${postNature} ${interviewPost} position. The candidate data is as below: 
        - Education Qualifications: ${educationQualifications}
        - Skills: ${coreSkills}
        ${assessmentArea === "Educational Background" || assessmentArea === "My aptitude" 
          ? `Ask one concise(short and sweet) question focusing on: ${prompts[assessmentArea]}.` 
          : `Ask one concise(short and sweet) question focusing on: ${prompts[assessmentArea]} for a beginner level candidate with limited experience.`}
        Ask only ONE question and wait for response.`;
      } else {
        // For other positions, include work experience
        return `Act as a ${companyName} company interviewer for a ${postNature} ${interviewPost} position. The candidate data is as below: 
        - Education Qualifications: ${educationQualifications}
        - Past Experience: ${pastWorkExperience}
        - Current Experience: ${currentWorkExperience}
        - Skills: ${coreSkills}
        Ask one concise(short and sweet) question focusing on: ${prompts[assessmentArea]}. Ask only ONE question and wait for response.`;
      }
    },
    [
      companyName,
      postNature,
      interviewPost,
      educationQualifications,
      pastWorkExperience,
      currentWorkExperience,
      coreSkills,
      prompts,
    ]
  );

  // Handle next question
  const handleNextQuestion = async () => {
    if (!userResponse || userResponse.trim() === "") {
      alert(
        "Please provide your answer before proceeding to the next question."
      );
      return;
    }

    const questionEndTime = Date.now();
    const questionDuration = Math.floor(
      (questionEndTime - questionStartTime) / 1000
    );

    setInterviewData((prev) => [
      ...prev,
      {
        question: currentQuestion,
        answer: userResponse.trim(),
        assessmentArea: assessmentAreas[currentQuestionIndex],
        timeSpent: questionDuration,
      },
    ]);

    setCurrentQuestionIndex((prev) => prev + 1);
    setQuestionTimer(0);

    if (currentQuestionIndex === assessmentAreas.length - 2) {
      setIsLastQuestion(true);
    }

    if (currentQuestionIndex < assessmentAreas.length - 1) {
      fetchNextQuestion();
    }
  };

  // Fetch next question from API
  const fetchNextQuestion = async (isFirstQuestion = false) => {
    setUserResponse("");
    setLoading(true);

    try {
      if (isFirstQuestion) {
        await APIService({
          question: initialPrompt,
          onResponse: handleOnResponse,
        });
      } else {
        const currentArea = assessmentAreas[currentQuestionIndex];
        const prompt = generateQuestionPrompt(currentArea);
        console.log(prompt);

        await APIService({
          question: prompt,
          onResponse: handleOnResponse,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle API response
  const handleOnResponse = useCallback((response) => {
    try {
      const responseText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      let SpeechResponse = responseText.slice(0, responseText.length);
      setSpeechResponse(SpeechResponse);
      setCurrentQuestion(responseText);
    } catch (error) {
      console.error("Error processing response:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle interview completion
  const finishInterview = async () => {
    setLoading(true);
    setIsLastQuestion(true);

    const questionEndTime = Date.now();
    const questionDuration = Math.floor(
      (questionEndTime - questionStartTime) / 1000
    );

    const finalInterviewData = [
      ...interviewData,
      {
        question: currentQuestion,
        answer: userResponse.trim(),
        assessmentArea: assessmentAreas[currentQuestionIndex],
        timeSpent: questionDuration,
      },
    ];

    const totalTimeInMinutes = Math.floor(totalTimer / 60);
    const totalTimeSeconds = totalTimer % 60;

    const Prompt = `Analyze interview performance for ${FullName} applying as ${postNature} 
    ${interviewPost} at ${companyName}. 
    
    Total Interview Duration: ${totalTimeInMinutes} minutes and ${totalTimeSeconds} seconds

    Below are the questions asked, candidate answers, and time spent on each response:
    ${finalInterviewData
      .map(
        (q, i) =>
          `${i + 1}. ${q.assessmentArea}:
           Question: ${q.question}
           Response Time: ${Math.floor(q.timeSpent / 60)}m ${q.timeSpent % 60}s
           Candidate Answer: ${q.answer}
           
           Analysis:
           - Response Time Analysis: ${
             q.timeSpent > 180
               ? "Took longer than recommended (>3 minutes)"
               : "Good response time"
           }
           - Answer Quality Assessment:
             * Clarity and Relevance
             * Technical Accuracy
             * Communication Style
           `
      )
      .join("\n\n")}
    
    Please provide a detailed analytical report covering:
    1. Overall Performance Assessment
       - Technical Knowledge
       - Communication Skills
       - Response Times
       - Confidence Level
    
    2. Strengths Demonstrated
    
    3. Areas for Improvement
    
    4. Specific Recommendations for:
       - How to structure responses better
       - Time management during interviews
       - Technical preparation
       - Communication enhancement
    
    5. Interview Best Practices:
       - How to begin an interview professionally
       - Maintaining proper response tone and structure
       - Time management per question
       - Professional interview conclusion
    
    Please be specific and constructive in your feedback.`;
    console.log(Prompt);

    try {
      await APIService({
        question: Prompt,
        onResponse: (resp) => {
          const analysisText =
            resp?.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis.";
          navigate("/interview-result", {
            state: {
              analysis: analysisText,
              totalTime: totalTimer,
              questionTimes: finalInterviewData.map((item) => ({
                question: item.question,
                timeSpent: item.timeSpent,
              })),
            },
          });
        },
      });
    } catch (error) {
      console.error("Error during finish interview:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle text-to-speech
  const handleSpeak = useCallback(() => {
    if (currentSpeechResponse && speechRef.current) {
      if (!isSpeaking) {
        try {
          // Make sure any ongoing speech recognition is stopped
          stopSpeechRecognition();
          
          setIsSpeaking(true);
          speechRef.current.play();
        } catch (error) {
          console.error("Error playing speech:", error);
          setIsSpeaking(false);
        }
      }
    }
  }, [currentSpeechResponse, isSpeaking]);

  // Handle stop speech
  const handleStop = useCallback(() => {
    if (speechRef.current) {
      try {
        setIsSpeaking(false);
        speechRef.current.pause();
        
        // Also cancel any ongoing speech synthesis
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (error) {
        console.error("Error stopping speech:", error);
        // Force UI update even if there's an error
        setIsSpeaking(false);
      }
    }
  }, [isSpeaking]);

  // Custom style for Speech component
  const speechStyle = {
    play: {
      display: 'none', // Hide the default play button
    },
    stop: {
      display: 'none', // Hide the default stop button
    }
  };

  // Speech recognition setup
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  
  // Check browser compatibility for speech recognition
  const isSpeechRecognitionSupported = useMemo(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const startSpeechRecognition = () => {
    try {
      // Check if there's already an active recognition session
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log("Error stopping previous recognition session", e);
        }
      }
      
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in your browser!");
        return;
      }

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      if (!transcriptRef.current) {
        setPreviewText("");
      }
    };

    let finalTranscript = transcriptRef.current || "";
    let interimTranscript = "";

    recognition.onresult = (event) => {
      interimTranscript = "";

      // Process only new results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          // Only append if it's not already in finalTranscript
          if (!finalTranscript.includes(transcript)) {
            finalTranscript += (finalTranscript ? " " : "") + transcript;
          }
        } else {
          interimTranscript = transcript;
        }
      }

      // Clean up any double spaces and trim
      finalTranscript = finalTranscript.replace(/\s+/g, " ").trim();

      // Update preview with final + interim transcripts
      const displayText = (
        finalTranscript + (interimTranscript ? " " + interimTranscript : "")
      ).trim();
      setPreviewText(displayText);
      transcriptRef.current = finalTranscript;
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        return;
      }
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setIsProcessingSpeech(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcriptRef.current) {
        setIsProcessingSpeech(true);
        // Add a small delay before setting processing to false to ensure UI feedback
        setTimeout(() => {
          setIsProcessingSpeech(false);
        }, 500);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      // If there's an error starting (like already running), try stopping first then starting again
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognition.start();
          }, 300);
        } catch (stopError) {
          console.error("Error stopping previous recognition:", stopError);
          setIsRecording(false);
        }
      }
    }
  } catch (error) {
    console.error("Speech recognition initialization error:", error);
    alert("There was an error initializing speech recognition. Please try again.");
    setIsRecording(false);
  }
};

  const stopSpeechRecognition = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
      // Force the UI to update even if there's an error
      setIsRecording(false);
    }
  };

  const handleSpeechInput = () => {
    // Check if speech recognition is supported
    if (!isSpeechRecognitionSupported) {
      alert("Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.");
      return;
    }
    
    setShowSpeechModal(true);
    
    // Reset transcript when opening modal to start fresh
    transcriptRef.current = "";
    setPreviewText("");
    
    // Auto-start speech recognition after a short delay
    setTimeout(() => {
      startSpeechRecognition();
    }, 500);
  };

  const handleFinalSubmit = () => {
    setUserResponse(previewText.trim());
    setShowSpeechModal(false);
    setIsRecording(false);
    setIsProcessingSpeech(false);
    transcriptRef.current = "";
    setPreviewText("");
  };

  const closeSpeechModal = () => {
    // Always attempt to stop recognition when closing the modal
    stopSpeechRecognition();
    
    // Clean up state
    setShowSpeechModal(false);
    setIsRecording(false);
    setIsProcessingSpeech(false);
    transcriptRef.current = "";
    setPreviewText("");
    
    // Make sure any ongoing speech synthesis is also stopped
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleBack = () => {
    // Save form data before navigating back
    if (location.state) {
      localStorage.setItem('mockInterviewFormData', JSON.stringify({
        fullName: location.state.FullName,
        educationQualifications: location.state.educationQualifications,
        pastWorkExperience: location.state.pastWorkExperience,
        currentWorkExperience: location.state.currentWorkExperience,
        coreSkills: location.state.coreSkills,
        companyName: location.state.companyName,
        companyType: location.state.companyType,
        interviewPost: location.state.interviewPost,
        postNature: location.state.postNature
      }));
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                className="mr-4 text-[var(--accent-teal)] hover:text-white transition-colors"
              >
                <IoArrowBack size={24} />
              </button>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
                Mock Interview Simulation
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowTips(!showTips)}
                className="px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 hover:opacity-90 flex items-center gap-2"
              >
                <IoInformationCircle className="text-lg" />
                <span>Interview Tips</span>
                <span className="ml-1">{showTips ? "▼" : "▶"}</span>
              </button>
              
              <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20 flex items-center gap-2">
                <FaRegClock className="text-[var(--accent-teal)]" />
                <span className="text-sm text-teal-100">Question:</span>
                <span className="font-medium">{formatTime(questionTimer)}</span>
              </div>
              
              <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20 flex items-center gap-2">
                <FaRegClock className="text-[var(--accent-teal)]" />
                <span className="text-sm text-teal-100">Total:</span>
                <span className="font-medium">{formatTime(totalTimer)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          {/* Speech Controls */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6 p-4 bg-[var(--primary-black)]/40 rounded-lg border border-[var(--accent-teal)]/20">
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isSpeaking 
                  ? "bg-[var(--accent-teal)]/20 text-[var(--accent-teal)] border border-[var(--accent-teal)]/30" 
                  : "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90"
              }`}
              onClick={handleSpeak}
            >
              <PiSpeakerHighFill className="text-lg" />
              <span>{isSpeaking ? "Speaking..." : "Speak"}</span>
            </button>
            
            <button
              className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20 hover:bg-[var(--primary-black)]/80 transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleStop}
            >
              <HiMiniStop className="text-lg" />
              <span>Stop</span>
            </button>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--primary-black)]/40 rounded-lg border border-[var(--accent-teal)]/20">
              <span className="text-sm text-teal-100">Speed:</span>
              <input
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
                className="w-32 h-2 bg-[var(--primary-black)]/60 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-teal)]"
              />
              <span className="text-sm font-medium">{speechRate}x</span>
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

          {/* Question and Answer Section */}
          <div className="space-y-6">
            {/* Question Display */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary-black)]/60 to-[var(--primary-violet)]/20 border border-[var(--accent-teal)]/20 mb-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">Interviewer Question:</h3>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>
                  {currentQuestion || "Loading the question..."}
                </ReactMarkdown>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-8">
                <LoadingSpinner />
                <p className="mt-4 text-teal-100">Preparing next question...</p>
              </div>
            )}

            {/* Answer Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">
                Your Answer:
              </h3>
              <div className="flex flex-col gap-3">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent min-h-[150px] transition-all"
                  rows={6}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSpeechInput}
                    className="p-3 bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg"
                    title="Speech Input"
                  >
                    <PiMicrophoneDuotone size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6">
              {!loading && (
                <button
                  onClick={isLastQuestion ? finishInterview : handleNextQuestion}
                  className={`px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:opacity-90 flex items-center gap-2 ${
                    isLastQuestion
                      ? "bg-gradient-to-r from-green-500 to-[var(--accent-teal)]"
                      : "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)]"
                  } text-white font-medium`}
                  disabled={loading || !userResponse.trim()}
                >
                  <span>{isLastQuestion ? "Finish Interview" : "Next Question"}</span>
                  {isLastQuestion ? <IoCheckmarkCircle className="text-lg" /> : <IoArrowBack className="text-lg transform rotate-180" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Tips Modal - For all screen sizes */}
      {showTips && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[var(--primary-black)] to-[var(--primary-violet)]/30 p-6 rounded-xl border border-[var(--accent-teal)]/20 shadow-2xl max-w-md w-full mx-4 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Interview Tips
              </h3>
              <button
                onClick={() => setShowTips(false)}
                className="p-2 hover:bg-[var(--primary-black)]/60 rounded-full transition-colors"
              >
                <IoClose size={24} className="text-[var(--accent-teal)]" />
              </button>
            </div>
            <div className="space-y-4">
              {interviewTipsData.map((tip, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/10 text-white"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Speech Modal */}
      {showSpeechModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[var(--primary-black)] to-[var(--primary-violet)]/30 p-6 rounded-xl border border-[var(--accent-teal)]/20 shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                Speech Input
              </h3>
              <button
                onClick={closeSpeechModal}
                className="p-2 hover:bg-[var(--primary-black)]/60 rounded-full transition-colors"
              >
                <IoClose size={24} className="text-[var(--accent-teal)]" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <button
                  onClick={() => {
                    if (!isRecording) {
                      startSpeechRecognition();
                    } else {
                      stopSpeechRecognition();
                    }
                  }}
                  disabled={isProcessingSpeech}
                  className={`p-6 rounded-full shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRecording
                      ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse"
                      : "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)]"
                  }`}
                >
                  <PiMicrophoneDuotone
                    size={40}
                    className={isRecording ? "animate-bounce text-white" : "text-white"}
                  />
                </button>
                {isRecording && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                )}
              </div>
              <p className="text-lg font-medium text-white">
                {isProcessingSpeech
                  ? "Processing speech..."
                  : isRecording
                  ? "Recording... Click to stop"
                  : "Click to start recording"}
              </p>
              {isProcessingSpeech && (
                <div className="mt-2">
                  <LoadingSpinner />
                </div>
              )}
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-teal-100 mb-2">Preview:</p>
              <div className="p-4 bg-[var(--primary-black)]/60 text-white rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto border border-[var(--accent-teal)]/20 shadow-inner">
                {previewText || "Your speech will appear here..."}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleFinalSubmit}
                  disabled={!previewText.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Use This Response</span>
                  <IoCheckmarkCircle className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default InterviewSimulation;
