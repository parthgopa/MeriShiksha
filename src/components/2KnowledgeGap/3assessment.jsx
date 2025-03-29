import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";
import BlackLoadingSpinner from "../BlackLoadingSpinner";
import { FaArrowRight, FaArrowLeft, FaGraduationCap } from "react-icons/fa";

const Assessment = () => {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [mcqs, setMcqs] = useState(null);
  const [currentLevel, setCurrentLevel] = useState("Primary");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [LOading, setLOading] = useState(false);
  const [nextTopicMcqs, setNextTopicMcqs] = useState(null);

  const navigate = useNavigate();
  const location = useLocation(null);
  const { topics } = location.state;
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const levels = ["Primary", "Secondary", "Advanced"];

  // Handle user's answer selection
  const handleAnswer = (level, questionIndex, selectedOption) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentTopicIndex] = updatedAnswers[currentTopicIndex] || {
        topic: topics[currentTopicIndex],
        answers: {},
      };
      updatedAnswers[currentTopicIndex].answers[level] =
        updatedAnswers[currentTopicIndex].answers[level] || [];
      updatedAnswers[currentTopicIndex].answers[level][questionIndex] = {
        selectedOption,
        correctAnswer: mcqs[level][questionIndex].answer,
        question: mcqs[level][questionIndex].question,
        options: mcqs[level][questionIndex].options,
      };
      return updatedAnswers;
    });
  };

  // Function to fetch MCQs for the current topic
  const fetchMCQsForCurrentTopic = async (topicIndex) => {
    const topic = topics[topicIndex];
    const prompt = `
      Generate a JSON object containing 6 multiple-choice questions for the topic "${topic}". 
      Divide the questions into three levels: Primary (2 questions), Secondary (2 questions), Advanced (2 questions). 
      Each question should include:
      1. The question text.
      2. Four options (a, b, c, d).
      3. The correct answer.
      Format the response as:
      {
        "topic": "${topic}",
        "levels": {
          "Primary": [
            { "question": "...", "options": { "a": "...", "b": "...", "c": "...", "d": "..." }, "answer": "a"},
            ...
          ],
          "Secondary": [...],
          "Advanced": [...]
        }
      }
      .For date: ${date} and time: ${time}(dont display it in output)  
    `;

    return new Promise((resolve) => {
      APIService({
        question: prompt,
        onResponse: (data) => {
          let temp = data.candidates[0].content.parts[0].text;
          let temp2 = temp.slice(7, temp.length - 4);
          try {
            const jsonResponse = JSON.parse(temp2);
            resolve(jsonResponse.levels);
          } catch (error) {
            console.error("Error parsing API response:", error);
            resolve(null);
          }
        },
      });
    });
  };

  // Pre-fetch next topic's MCQs
  const prefetchNextTopicMCQs = async () => {
    if (currentTopicIndex < topics.length - 1) {
      const nextMcqs = await fetchMCQsForCurrentTopic(currentTopicIndex + 1);
      setNextTopicMcqs(nextMcqs);
    }
  };

  // Handle moving to the next level or topic
  const nextStep = async () => {
    if (currentLevel === "Advanced") {
      if (currentTopicIndex < topics.length - 1) {
        setLOading(true);
        if (nextTopicMcqs) {
          setCurrentTopicIndex((prevIndex) => prevIndex + 1);
          setCurrentLevel("Primary");
          setMcqs(nextTopicMcqs);
          setNextTopicMcqs(null);
          setLOading(false);
          // Start prefetching the next topic's MCQs
          prefetchNextTopicMCQs();
        }
      } else {
        setLOading(true);
        navigate("/knowledge-gap/report", {
          state: { assessmentData: answers },
        });
      }
    } else {
      const nextLevelIndex = levels.indexOf(currentLevel) + 1;
      setCurrentLevel(levels[nextLevelIndex]);
      setAnswers((prev) => {
        const updatedAnswers = [...prev];
        updatedAnswers[currentTopicIndex] = updatedAnswers[currentTopicIndex] || {
          topic: topics[currentTopicIndex],
          answers: {},
        };
        updatedAnswers[currentTopicIndex].answers[levels[nextLevelIndex]] = [];
        return updatedAnswers;
      });
    }
  };

  // Initial fetch of MCQs
  useEffect(() => {
    const initializeMCQs = async () => {
      if (!mcqs) {
        setLoading(true);
        const initialMcqs = await fetchMCQsForCurrentTopic(currentTopicIndex);
        setMcqs(initialMcqs);
        setLoading(false);
        // Start prefetching the next topic's MCQs
        prefetchNextTopicMCQs();
      }
    };
    initializeMCQs();
  }, []);

  if (!mcqs) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <BlackLoadingSpinner />
          <p className="mt-4 text-white text-lg animate-pulse">Preparing your assessment questions...</p>
        </div>
      </div>
    );
  }

  const questions = mcqs[currentLevel];

  // Get level color
  const getLevelColor = (level) => {
    switch(level) {
      case "Primary": return "from-green-500 to-green-600";
      case "Secondary": return "from-blue-500 to-blue-600";
      case "Advanced": return "from-purple-500 to-purple-600";
      default: return "from-[var(--accent-teal)] to-[var(--primary-violet)]";
    }
  };

  // Get level icon
  const getLevelIcon = (level) => {
    return <FaGraduationCap className="text-white" />;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      {LOading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <BlackLoadingSpinner />
            <p className="mt-4 text-lg animate-pulse">Loading next topic...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            {/* Progress indicators */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
                  Knowledge Assessment
                </h2>
                
                <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getLevelColor(currentLevel)} flex items-center gap-2`}>
                  {getLevelIcon(currentLevel)}
                  <span className="font-medium">{currentLevel} Level</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20 flex-grow">
                  <span className="text-[var(--accent-teal)]">Topic:</span> {topics[currentTopicIndex]}
                </div>
                <div className="px-4 py-2 bg-[var(--primary-black)]/60 rounded-lg border border-[var(--accent-teal)]/20">
                  <span className="text-[var(--accent-teal)]">Progress:</span> {currentTopicIndex + 1}/{topics.length}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-[var(--primary-black)]/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] transition-all duration-500"
                  style={{ 
                    width: `${((currentTopicIndex * 3 + levels.indexOf(currentLevel) + 1) / (topics.length * 3)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            {/* Questions */}
            <div className="space-y-8 mb-8">
              {questions.map((q, index) => (
                <div 
                  key={index}
                  className="bg-[var(--primary-black)]/40 rounded-xl p-6 border border-[var(--accent-teal)]/10 transition-all hover:border-[var(--accent-teal)]/30"
                >
                  <h3 className="text-xl font-semibold mb-6 text-white">
                    {index + 1}. {q.question}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(q.options).map(([key, value]) => (
                      <div
                        key={key}
                        onClick={() => handleAnswer(currentLevel, index, key)}
                        className={`
                          p-4 rounded-lg border cursor-pointer transition-all transform hover:scale-[1.02]
                          ${
                            answers[currentTopicIndex]?.answers[currentLevel]?.[index]?.selectedOption === key
                              ? "bg-gradient-to-r from-[var(--accent-teal)]/30 to-[var(--primary-violet)]/30 border-[var(--accent-teal)]"
                              : "bg-[var(--primary-black)]/60 border-[var(--primary-black)]/80 hover:border-[var(--accent-teal)]/30"
                          }
                        `}
                      >
                        <label className="flex items-start gap-3 cursor-pointer w-full">
                          <div className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5
                            ${
                              answers[currentTopicIndex]?.answers[currentLevel]?.[index]?.selectedOption === key
                                ? "bg-[var(--accent-teal)]"
                                : "border-2 border-gray-400"
                            }
                          `}>
                            {answers[currentTopicIndex]?.answers[currentLevel]?.[index]?.selectedOption === key && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="text-white">{key.toUpperCase()}. {value}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              {currentLevel !== "Primary" || currentTopicIndex > 0 ? (
                <button
                  onClick={() => {
                    if (currentLevel === "Primary") {
                      setCurrentTopicIndex(currentTopicIndex - 1);
                      setCurrentLevel("Advanced");
                    } else {
                      setCurrentLevel(levels[levels.indexOf(currentLevel) - 1]);
                    }
                  }}
                  className="px-6 py-3 bg-[var(--primary-black)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--primary-black)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                >
                  <FaArrowLeft className="text-[var(--accent-teal)]" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div> // Empty div to maintain flex layout
              )}
              
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
              >
                <span>
                  {currentLevel === "Advanced" && currentTopicIndex === topics.length - 1
                    ? "Complete Assessment"
                    : "Next"
                  }
                </span>
                <FaArrowRight />
              </button>
            </div>
          </div>
          
          {/* Home Button */}
          <div className="fixed bottom-6 right-6 z-10">
            <HomeButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
