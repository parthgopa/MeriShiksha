import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import APIService from '../API';
import { useLocation, useNavigate } from 'react-router';
import LoadingSpinner from '../LoadingSpinner';
import HomeButton from '../HomeButton';
import { useSpeechSynthesis } from 'react-speech-kit';
import { HiMiniStop } from "react-icons/hi2";
import { PiSpeakerHighFill } from "react-icons/pi";

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

  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const { speak, cancel, speaking, supported } = useSpeechSynthesis();

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
    if (currentQuestion) {
      speak({ text: currentQuestion, rate: speechRate });
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
    return () => cancel();
  }, []);

  useEffect(() => {
    if (analysis && analysisRef) {
      setTimeout(() => {
        analysisRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [analysis, analysisRef]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gradient-to-r from-secondary via-60% to-black from-65% p-2 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold text-white mb-4">
            {language} Language Learning - Question {qaHistory.length + 1}/20
          </h4>
          
          {supported && (
            <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
              <button
                className="btn btn-info px-4 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleSpeak}
              >
                {speaking ? "Speaking..." : <PiSpeakerHighFill />}
              </button>
              <button
                className="btn btn-info px-4 py-2 rounded-lg transition-all hover:scale-105"
                onClick={cancel}
              >
                <HiMiniStop />
              </button>
              <label className="flex items-center gap-2">
                Speed:
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-32 rounded-lg bg-secondary text-white"
                />
                <span>{speechRate}x</span>
              </label>
            </div>
          )}
        </div>

        {isLoadingNext ? (
          <LoadingSpinner />
        ) : (
          <>
            <div id="output-container" className="p-4 rounded-lg bg-secondary text-white mb-6">
              <ReactMarkdown>{currentQuestion}</ReactMarkdown>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`Write your response in ${language}...`}
              disabled={isLoadingNext || qaHistory.length >= 20}
              className="w-full p-4 rounded-lg bg-secondary text-white mb-6 min-h-[100px]"
            />

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <button
                onClick={handleAnalyze}
                disabled={!userAnswer || isAnalyzing}
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2 min-w-[150px] justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5">
                      <LoadingSpinner />
                    </div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  'Analyze Answer'
                )}
              </button>

              
            </div>

            {analysis && (
              <div 
                ref={setAnalysisRef}
                className="analysis-container p-2 rounded-lg bg-secondary text-white mb-6"
              >
                <h3 className="text-lg text-white font-bold mb-2">Analysis:</h3>
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-4 mb-6">

            <button
                onClick={handleNextQuestion}
                disabled={isLoadingNext || qaHistory.length >= 20}
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2 min-w-[150px] justify-center"
              >
                {isLoadingNext ? (
                  <>
                    <div className="w-10 h-10">
                      <LoadingSpinner />
                    </div>
                    <span>Loading...</span>
                  </>
                ) : (
                  qaHistory.length >= 19 ? 'Finish Learning' : 'Next Question'
                )}
              </button>

              <button
                onClick={handleQuit}
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
              >
                Quit
              </button>
              </div>

            {qaHistory.length >= 20 && (
              <div className="completion-message p-4 rounded-lg bg-accent text-white text-center">
                <h3 className="text-lg font-bold">Learning Session Complete!</h3>
                <p>You've mastered all 20 questions. Great job!</p>
              </div>
            )}
          </>
        )}

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

export default AcceleratedPage;
