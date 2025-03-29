import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import APIService from '../API';
import { useLocation, useNavigate } from 'react-router';
import LoadingSpinner from '../LoadingSpinner';
import HomeButton from '../HomeButton';
import Speech from 'react-speech';
import { HiMiniStop } from "react-icons/hi2";
import { PiSpeakerHighFill } from "react-icons/pi";
import { IoArrowForward, IoClose, IoAnalytics } from "react-icons/io5";

const AcceleratedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = location.state;

  const [qaHistory, setQaHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState(null);
  const [showQuitPopup, setShowQuitPopup] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [analysisRef, setAnalysisRef] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);
  

  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const handleOnResponse = (response) => {
    const responseText = response.candidates[0].content.parts[0].text;
    return responseText;
  };

  // Initial question generation
  const getInitialQuestion = async () => {
    setIsLoadingNext(true);
    try {
      await APIService({
        question: `You are my mentor for language learning. 
        I want you to develop my ${language} vocabulary and speaking skills interactively. 
        Ask me a question in ${language} and I will give its answer.
        For date: ${date} and time: ${time}(dont display it in output)`,
        onResponse: (response) => {
          const question = handleOnResponse(response);
          setCurrentQuestion(question);
          setIsLoadingNext(false);
        }
      });
    } catch (error) {
      setError('Failed to get initial question');
      setIsLoadingNext(false);
    }
  };

  // Handle next question generation
  const handleNextQuestion = async () => {
    if (qaHistory.length >= 20) return;
    
    // First, save the current Q&A pair
    const updatedHistory = [...qaHistory, { question: currentQuestion, answer: userAnswer }];
    setQaHistory(updatedHistory);
    
    setIsLoadingNext(true);
    try {
      const historyPrompt = updatedHistory
        .map((qa, index) => `Q${index + 1}: ${qa.question}\nA: ${qa.answer}`)
        .join('\n\n');

      const question = `Based on this ${language} learning history:\n${historyPrompt}\n\nProvide another(short) question in ${language} to enhance vocabulary and speaking skills.`;
      
      await APIService({
        question,
        onResponse: (response) => {
          const newQuestion = handleOnResponse(response);
          setCurrentQuestion(newQuestion);
          setUserAnswer('');
          setAnalysis('');
          setIsLoadingNext(false);
        }
      });
    } catch (error) {
      setError('Failed to get next question');
      setIsLoadingNext(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await APIService({
        question: `You are my mentor in language learning. Help me to improve my response with positive touch.
        Analyze my response: '${userAnswer}' for the question: '${currentQuestion} I am asked'. 
        Identify areas for improvement in vocabulary used, suggestions. Provide output in bullet points. Make it short and sweet `,
        onResponse: (response) => {
          const analysisText = handleOnResponse(response);
          setAnalysis(analysisText);
          setIsAnalyzing(false);
        }
      });
    } catch (error) {
      setError('Failed to analyze answer');
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = () => {
    if (currentQuestion && speechRef.current) {
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

  const handleQuit = () => {
    setShowQuitPopup(true);
  };

  const confirmQuit = () => {
    navigate('/language-accelerator');
  };

  useEffect(() => {
    getInitialQuestion();
    // No need for cleanup as we're using our own stop function
  }, []);

  useEffect(() => {
    if (analysis && analysisRef) {
      setTimeout(() => {
        analysisRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [analysis, analysisRef]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              {language} Language Accelerator
            </h2>
            
            <div className="flex items-center justify-center mb-2">
              <div className="inline-flex items-center px-4 py-2 bg-[var(--primary-black)]/40 rounded-full border border-[var(--accent-teal)]/20">
                <span className="text-teal-100 mr-2">Question</span>
                <span className="text-white font-bold text-xl">{qaHistory.length + 1}</span>
                <span className="text-teal-100 mx-1">/</span>
                <span className="text-white font-bold text-xl">20</span>
              </div>
            </div>
            
            {/* Speech Controls */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
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
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-[var(--primary-black)]/60 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-teal)]"
                />
                <span className="text-sm font-medium">{speechRate}x</span>
              </div>
              
              {/* Hidden Speech component controlled via ref */}
              <div style={{ display: 'none' }}>
                <Speech
                  ref={speechRef}
                  text={currentQuestion}
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

          {isLoadingNext ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner />
              <p className="mt-4 text-teal-100">Preparing your next question...</p>
            </div>
          ) : (
            <>
              {/* Question Container */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary-black)]/60 to-[var(--primary-violet)]/20 border border-[var(--accent-teal)]/20 mb-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-3 text-[var(--accent-teal)]">Question:</h3>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{currentQuestion}</ReactMarkdown>
                </div>
              </div>

              {/* Answer Textarea */}
              <div className="mb-6">
                <label className="block text-teal-100 mb-2 text-sm">Your response:</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={`Write your response in ${language}...`}
                  disabled={isLoadingNext || qaHistory.length >= 20}
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent min-h-[120px] transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <button
                  onClick={handleAnalyze}
                  disabled={!userAnswer || isAnalyzing}
                  className={`px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    !userAnswer || isAnalyzing
                      ? "bg-[var(--primary-black)]/40 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 shadow-lg"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner className="w-5 h-5" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <IoAnalytics className="text-lg" />
                      <span>Analyze Answer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={isLoadingNext || qaHistory.length >= 20}
                  className={`px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    isLoadingNext || qaHistory.length >= 20
                      ? "bg-[var(--primary-black)]/40 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] hover:opacity-90 shadow-lg"
                  }`}
                >
                  {isLoadingNext ? (
                    <>
                      <LoadingSpinner className="w-5 h-5" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>{qaHistory.length >= 19 ? 'Finish Learning' : 'Next Question'}</span>
                      <IoArrowForward className="text-lg" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleQuit}
                  className="px-5 py-3 bg-[var(--primary-black)]/60 text-white rounded-lg border border-[var(--accent-teal)]/20 hover:bg-[var(--primary-black)]/80 transition-all duration-300 flex items-center gap-2"
                >
                  <IoClose className="text-lg" />
                  <span>Quit</span>
                </button>
              </div>

              {/* Analysis Container */}
              {analysis && (
                <div 
                  ref={setAnalysisRef}
                  className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary-violet)]/30 to-[var(--primary-black)]/60 border border-[var(--primary-violet)]/30 mb-6 shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                    Analysis:
                  </h3>
                  <div className="prose prose-invert max-w-none prose-li:marker:text-[var(--accent-teal)]">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Completion Message */}
              {qaHistory.length >= 20 && (
                <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--accent-teal)]/30 to-[var(--primary-violet)]/30 border border-[var(--accent-teal)]/20 text-center mb-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                    Learning Session Complete!
                  </h3>
                  <p className="text-teal-100">You've mastered all 20 questions. Great job!</p>
                  <button
                    onClick={() => navigate('/language-accelerator')}
                    className="mt-4 px-5 py-2 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 hover:opacity-90"
                  >
                    Return to Language Accelerator
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quit Confirmation Popup */}
      {showQuitPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[var(--primary-black)] to-[var(--primary-violet)]/30 p-6 rounded-xl border border-[var(--accent-teal)]/20 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
              Quit Session?
            </h3>
            <p className="text-center mb-6 text-gray-300">
              Are you sure you want to quit this learning session? Your progress will not be saved.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowQuitPopup(false)}
                className="px-5 py-2 bg-[var(--primary-black)]/60 text-white rounded-lg border border-[var(--accent-teal)]/20 hover:bg-[var(--primary-black)]/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuit}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
              >
                Quit
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
  );
};

export default AcceleratedPage;
