import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";
import { IoArrowBack, IoArrowForward, IoCheckmarkDone } from "react-icons/io5";

const MCQTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, level, numMCQs, comingfrom } = location.state;

  const [incomingdata, setIncomingdata] = useState(comingfrom);
  //console.log(incomingdata);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  useEffect(() => {
    const fetchMCQs = async () => {
      let prompt;
      if (incomingdata === "FromParagraph") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the Paragraph Provided =>: "${topic}" at '${level}' level. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      }. For current date :${date} and current time :${time}`;
      } else if (incomingdata === "FromTopicLearning") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the topic '${topic}' at '${level}' level. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };  For current date :${date} and current time :${time}`;
      } else if (incomingdata === "RetakeMCQs") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the topic '${topic}' at '${level}' level different from the previous one. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };  For current date :${date} and current time :${time}`;
      } else if (incomingdata === "Quiz Play") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the topic '${topic}' at '${level}' level different from the previous one. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };  For current date :${date} and current time :${time}`;
      }

      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [numMCQs, topic, level]);

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
    navigate("/final-result", {
      state: { userAnswers, correctAnswers, questions, topic, level },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 md:py-10 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            {incomingdata === "FromTopicLearning" && `MCQ Quiz: ${topic}`}
            {incomingdata === "FromParagraph" && "MCQ Quiz"}
            {incomingdata === "RetakeMCQs" && "ReTest Quiz"}
            {incomingdata === "Quiz Play" && "Quiz Play"}
          </h1>
          
          {/* Progress Bar */}
          {!loading && (
            <div className="w-full h-2 bg-[var(--primary-black)]/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          )}
          
          {/* Question Counter */}
          {!loading && questions.length > 0 && (
            <div className="text-center mt-4 text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm mb-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6 text-white">
                  {questions[currentQuestionIndex]}
                </h2>
                <div className="space-y-4">
                  {options[currentQuestionIndex].map((option, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                        userAnswers[currentQuestionIndex] === option
                          ? "bg-gradient-to-r from-[var(--accent-teal)]/80 to-[var(--primary-violet)]/80 border-transparent"
                          : "bg-[var(--primary-black)]/40 border border-[var(--accent-teal)]/20 hover:bg-[var(--primary-black)]/60"
                      }`}
                      onClick={() => handleAnswerChange(currentQuestionIndex, option)}
                    >
                      <input
                        type="radio"
                        id={`mcq-${currentQuestionIndex}-option-${idx}`}
                        name={`mcq-${currentQuestionIndex}`}
                        value={option}
                        checked={userAnswers[currentQuestionIndex] === option}
                        onChange={() => handleAnswerChange(currentQuestionIndex, option)}
                        className="peer hidden"
                      />
                      <label
                        htmlFor={`mcq-${currentQuestionIndex}-option-${idx}`}
                        className="text-base font-medium w-full cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Navigation Buttons */}
        {!loading && (
          <div className="flex justify-between items-center gap-4 mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                currentQuestionIndex === 0
                  ? "bg-[var(--primary-black)]/60 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white hover:opacity-90"
              }`}
            >
              <IoArrowBack size={20} />
              <span>Previous</span>
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <span>Next</span>
                <IoArrowForward size={20} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <span>Finish</span>
                <IoCheckmarkDone size={20} />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default MCQTest;
