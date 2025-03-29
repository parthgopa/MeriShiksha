import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

const LanguageQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, currentPart, quizprompt } = location.state;

  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMCQs = async () => {
      let prompt = quizprompt;

      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, []);

  const handleOnResponse = (response) => {
    try {
      let mcqData = response["candidates"][0]["content"]["parts"][0]["text"];
      mcqData = mcqData.slice(7, mcqData.length - 4);
      mcqData = JSON.parse(mcqData);

      try {
        setQuestions(mcqData.questions);
        setOptions(mcqData.options);
        setCorrectAnswers(mcqData.correctAnswers);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        navigate("/error", { h2: "SOlve the error message" });
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    }
    setLoading(false);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    navigate("/language-result", {
      state: { userAnswers, correctAnswers, questions, currentPart, language },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            {language} Language Quiz
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-[var(--primary-black)]/40 rounded-full border border-[var(--accent-teal)]/20">
            <span className="text-teal-100 mr-2">Part</span>
            <span className="text-white font-bold text-xl">{currentPart}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <LoadingSpinner />
              <p className="mt-4 text-teal-100">Preparing your quiz questions...</p>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-teal-100">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-teal-100">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-2 bg-[var(--primary-black)]/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] transition-all duration-500"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              
              {/* Question */}
              <div className="mb-8">
                <div className="p-4 bg-[var(--primary-black)]/40 rounded-lg border border-[var(--accent-teal)]/20 mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {questions[currentQuestionIndex]}
                  </h2>
                </div>
                
                {/* Options */}
                <div className="space-y-3">
                  {options[currentQuestionIndex]?.map((option, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                        userAnswers[currentQuestionIndex] === option
                          ? "border-[var(--accent-teal)] bg-[var(--accent-teal)]/10"
                          : "border-[var(--primary-violet)]/30 hover:border-[var(--accent-teal)]/50 hover:bg-[var(--primary-black)]/40"
                      }`}
                      onClick={() => handleAnswerChange(currentQuestionIndex, option)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          userAnswers[currentQuestionIndex] === option
                            ? "border-[var(--accent-teal)] bg-[var(--accent-teal)]"
                            : "border-white"
                        }`}>
                          {userAnswers[currentQuestionIndex] === option && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-lg ${
                          userAnswers[currentQuestionIndex] === option
                            ? "text-[var(--accent-teal)]"
                            : "text-white"
                        }`}>
                          {option}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button
                  className={`px-6 py-3 bg-gradient-to-r from-[var(--primary-black)] to-[var(--primary-violet)]/70 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center ${
                    currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <IoArrowBack className="mr-2" />
                  <span>Previous</span>
                </button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
                    onClick={handleFinish}
                  >
                    <IoCheckmarkDoneCircleOutline className="mr-2" />
                    <span>Finish Quiz</span>
                  </button>
                ) : (
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center"
                    onClick={handleNext}
                  >
                    <span>Next</span>
                    <IoArrowForward className="ml-2" />
                  </button>
                )}
              </div>
            </>
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

export default LanguageQuiz;
