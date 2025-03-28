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
import { IoClose } from "react-icons/io5";

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
        setIsSpeaking(true);
        speechRef.current.play();
      }
    }
  }, [currentSpeechResponse, isSpeaking]);

  // Handle stop speech
  const handleStop = useCallback(() => {
    if (isSpeaking && speechRef.current) {
      setIsSpeaking(false);
      speechRef.current.pause();
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

  const startSpeechRecognition = () => {
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
        setIsProcessingSpeech(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSpeechInput = () => {
    setShowSpeechModal(true);

    // Don't reset transcript when opening modal
    if (!transcriptRef.current) {
      transcriptRef.current = "";
      setPreviewText("");
    }
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
    if (isRecording) {
      stopSpeechRecognition();
    }
    setShowSpeechModal(false);
    setIsRecording(false);
    setIsProcessingSpeech(false);
    transcriptRef.current = "";
    setPreviewText("");
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
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white flex items-center justify-center">
      <div className="w-screen max-w-7xl mx-auto p-3 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold">Mock Interview Simulation</h2>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <button
              onClick={() => setShowTips(!showTips)}
              className="btn btn-info rounded-lg flex items-center gap-2"
            >
              <span>Interview Tips</span>
              <span>{showTips ? "▼" : "▶"}</span>
            </button>
            <div className="bg-secondary/50 p-2 rounded-lg">
              Question Timer: {formatTime(questionTimer)}
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg">
              Total Time: {formatTime(totalTimer)}
            </div>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-dark text-white rounded-lg hover:bg-accent transition-all transform hover:scale-105"
            >
              Back
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Interview Area */}
          <div className="w-screen max-w-7xl mx-auto">
            <div className="bg-secondary/20 p-3 rounded-xl shadow-lg">
              {/* Speech Controls */}
              <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                <button
                  className="btn btn-info px-4 py-2 rounded-lg transition-all hover:scale-105"
                  onClick={handleSpeak}
                >
                  {isSpeaking ? "Speaking..." : <PiSpeakerHighFill />}
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
                    className="w-32 rounded-lg bg-secondary text-white"
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
                </label>
                <span className="text-white font-medium">{speechRate}x</span>
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
              <div className="space-y-4">
                <div className="bg-secondary/90 p-4 rounded-lg">
                  <ReactMarkdown className="text-white text-lg">
                    {currentQuestion || "Loading the question..."}
                  </ReactMarkdown>
                </div>

                {loading && <LoadingSpinner />}

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Your Answer:
                  </h3>
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={6}
                    />
                    <button
                      onClick={handleSpeechInput}
                      className="p-2 btn btn-dark w-13 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="Speech Input"
                    >
                      <PiMicrophoneDuotone size={34} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end m-4">
                  {!loading && (
                    <button
                      onClick={
                        isLastQuestion ? finishInterview : handleNextQuestion
                      }
                      className={`${
                        isLastQuestion
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-teal-100 hover:bg-blue-700"
                      } text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105`}
                      disabled={loading || !userResponse.trim()}
                    >
                      {isLastQuestion ? "Finish Interview" : "Next Question"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Tips Modal - For all screen sizes */}
      {showTips && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary/90 rounded-xl p-6 m-4 max-h-[80vh] w-full max-w-md overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Interview Tips
              </h3>
              <button
                onClick={() => setShowTips(false)}
                className="p-2 hover:bg-secondary/50 rounded-full"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {interviewTipsData.map((tip, index) => (
                <div
                  key={index}
                  className="bg-secondary/30 p-3 rounded-lg text-xl"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Speech Input</h3>
              <button
                onClick={closeSpeechModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose size={24} className="text-gray-600" />
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
                  className={`p-6 rounded-full ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                >
                  <PiMicrophoneDuotone
                    size={40}
                    className={isRecording ? "animate-bounce" : ""}
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
              <p className="text-lg font-medium text-gray-600">
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
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="p-4 bg-gray-50 text-gray-800 rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-200 shadow-inner">
                {previewText || "Your speech will appear here..."}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleFinalSubmit}
                  disabled={!previewText.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors shadow-md transform hover:scale-105"
                >
                  Final Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <HomeButton></HomeButton>
    </div>
  );
};

export default InterviewSimulation;
