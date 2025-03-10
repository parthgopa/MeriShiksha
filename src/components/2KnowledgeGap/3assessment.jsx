import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router"; // Assuming React Router is used for navigation
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";
import BlackLoadingSpinner from "../BlackLoadingSpinner";

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
      <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-1 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <BlackLoadingSpinner />
          <p className="mt-4 text-white">Loading questions...</p>
        </div>
      </div>
    );
  }

  const questions = mcqs[currentLevel];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-1 flex justify-center items-center">
      <div className="container mx-auto p-4 text-center">
        <div className="mb-8">
          <h4 className="text-2xl font-bold mb-2 mt-0 text-center text-white">
            Assessment Topic: {topics[currentTopicIndex]}
          </h4>
          <ul className="space-y-0">
            {questions.map((q, index) => (
              <li
                key={index}
                className="bg-gradient-to-r from-black via-gray to-secondary border border-white rounded-lg shadow-md p-3 text-left hover:bg-gray-900 transition-colors m-2"
              >
                <h4 className="text-xl font-semibold mb-4 text-white justify-self-start">
                  {q.question}
                </h4>
                {Object.entries(q.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-3 p-2 rounded-lg text-white border border-gray-600 cursor-pointer m-2 ${
                      answers[currentTopicIndex]?.answers[currentLevel]?.[index]
                        ?.selectedOption === key
                        ? "bg-gray-600"
                        : "hover:bg-gray-600"
                    }`}
                    onClick={() => handleAnswer(currentLevel, index, key)}
                  >
                    <input
                      type="radio"
                      id={`question-${index}-${key}`}
                      name={`question-${index}`}
                      value={key}
                      checked={
                        answers[currentTopicIndex]?.answers[currentLevel]?.[index]
                          ?.selectedOption === key
                      }
                      onChange={() => handleAnswer(currentLevel, index, key)}
                      className="peer hidden"
                    />
                    <label
                      htmlFor={`question-${index}-${key}`}
                      className="text-sm font-medium px-3 py-1 rounded-md transition-all w-full text-white"
                    >
                      {value}
                    </label>
                  </div>
                ))}
              </li>
            ))}
          </ul>
          <div className="mt-6 relative">
            {LOading && (
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
                <BlackLoadingSpinner />
              </div>
            )}
            <button
              onClick={nextStep}
              className="px-6 py-2 btn btn-info hover:scale-105"
              disabled={LOading}
            >
              {currentLevel === "Advanced" &&
              currentTopicIndex === topics.length - 1
                ? "Finish Assessment"
                : currentLevel === "Advanced"
                ? "Next Topic"
                : "Next Level"}
            </button>
          </div>
        </div>
        <HomeButton />
      </div>
    </div>
  );
};

export default Assessment;
