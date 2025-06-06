import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
// import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";
import LoadingSpinner from "../LoadingSpinner";

const QuizPlayQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, topic, level, numMCQs, comingfrom } = location.state;

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
      if (incomingdata === "FromQuizPlay") {
        prompt = `Generate ${numMCQs} Randomized MCQs(Note that this MCQs Specifically for MCQ-Quiz so this must be other than previously generated MCQs.) for the topic :'${topic}' in context with subject :${subject}  having study level :'${level}'. The output should be a valid JSON object in the following format:
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
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex justify-center items-center">
      <div className="max-w-4xl w-full p-8 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
        <h4 className="text-xl font-bold mb-4 text-white">{`MCQ Quiz : ${topic}`}</h4>
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="w-full h-4 bg-gray-700 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>

              {/* MCQ Section */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold mb-4">{`(${
                  currentQuestionIndex + 1
                }/${questions.length}) ${questions[currentQuestionIndex]}`}</h5>
                <div className="space-y-4">
                  {options[currentQuestionIndex].map((option, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2 rounded-lg text-white border border-gray-600 cursor-pointer 
      ${
        userAnswers[currentQuestionIndex] === option
          ? "bg-white text-black"
          : "hover:bg-gray-600"
      }`}
                      onClick={() =>
                        handleAnswerChange(currentQuestionIndex, option)
                      }
                    >
                      <input
                        type="radio"
                        id={`mcq-${currentQuestionIndex}-option-${idx}`}
                        name={`mcq-${currentQuestionIndex}`}
                        value={option}
                        checked={userAnswers[currentQuestionIndex] === option}
                        onChange={() =>
                          handleAnswerChange(currentQuestionIndex, option)
                        }
                        className="peer hidden"
                      />
                      <label
                        htmlFor={`mcq-${currentQuestionIndex}-option-${idx}`}
                        className={`text-sm font-medium px-3 py-1 rounded-md transition-all w-full 
        ${
          userAnswers[currentQuestionIndex] === option
            ? "text-black"
            : "text-white"
        }`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button Group */}
              <div className="flex justify-between items-center gap-4">
                <button
                  className={`btn btn-info transition-all ${
                    currentQuestionIndex === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <button
                  className={`btn btn-info transition-all ${
                    currentQuestionIndex === questions.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </button>
                <button
                  className={`btn btn-info transition-all ${
                    currentQuestionIndex !== questions.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleFinish}
                  disabled={currentQuestionIndex !== questions.length - 1}
                >
                  Finish
                </button>
              </div>
            </>
          )}
        </div>
        {/* Progress Bar */}

        {/* Home Button */}
        <div className="mt-6">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default QuizPlayQuiz;
