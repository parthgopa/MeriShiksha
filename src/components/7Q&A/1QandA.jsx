import React, { useState } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import { IoArrowForward } from "react-icons/io5";
import { FaQuestionCircle, FaCheck, FaInfoCircle } from "react-icons/fa";

const QandA = () => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    types: {
      veryshort: { checked: false, count: "", difficulty: "Primary" },
      short: { checked: false, count: "", difficulty: "Primary" },
      long: { checked: false, count: "", difficulty: "Primary" },
      truefalse: { checked: false, count: "", difficulty: "Primary" },
      fillintheblanks: { checked: false, count: "", difficulty: "Primary" },
    },
  });
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle checkbox toggling
  const handleCheckboxChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          checked: !prev.types[type].checked,
        },
      },
    }));
  };

  // Handle changes in the number input and difficulty selection
  const handleTypeChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          [field]: value,
        },
      },
    }));
  };

  const generatePrompt = (e) => {
    const subject = e.target[0].value;
    const topic = e.target[1].value;
    e.preventDefault();
    let prompt = `Generate questions(in proper format) for the subject "${subject}" and topic "${topic}". Each question and answer should include a serial number.`;

    for (const [key, value] of Object.entries(formData.types)) {
      if (value.checked) {
        let additionalText = ""; // Store additional text based on question type

        switch (key.toLowerCase().trim()) {
          case "veryshort":
            additionalText = " with very concise answers(max 1-2 lines)";
            break;
          case "short":
            additionalText = " with concise answers(2-3 lines)";
            break;
          case "long":
            additionalText = " with detailed answers";
            break;
          case "multipleChoice":
            additionalText = " with four answer choices and one correct answer";
            break;
          case "truefalse":
            additionalText = " as a true/false statement";
            break;
          case "fillintheblanks":
            additionalText =
              " with a missing word that needs to be filled(along with answers)";
            break;

          default:
            additionalText = ""; // No extra text for unknown question types
        }

        // Append to the prompt
        prompt += `\nGenerate ${value.count} ${key
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} questions at ${
          value.difficulty
        } level${additionalText}.`;

        prompt += `\n For date: ${date} and time: ${time}(dont display it in output)`;
      }
    }

    if (subject && topic) {
      navigate("/q-and-a/2page", {
        state: {
          subject: subject,
          topic: topic,
          prompt: prompt,
        },
      });
    } else {
      setWarning(true);
      setTimeout(() => setWarning(false), 3000);
    }

    return prompt;
  };

  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      generatePrompt;
    }
  };

  // Check if at least one question type is selected and has a count
  const isFormValid = () => {
    const hasSubjectAndTopic = formData.subject && formData.topic;
    const hasValidQuestionType = Object.values(formData.types).some(
      (type) => type.checked && type.count
    );
    return hasSubjectAndTopic && hasValidQuestionType;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Questions & Answers Generator
          </h2>
          
          <form
            onSubmit={generatePrompt}
            onKeyDown={handleEnterPressed}
            className="space-y-8"
          >
            {/* Subject Entry */}
            <div className="space-y-2">
              <label
                htmlFor="SubjectEntry"
                className="block text-lg font-medium text-white"
              >
                Enter the Subject
              </label>
              <input
                type="text"
                id="SubjectEntry"
                name="SubjectEntry"
                className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="Physics, Mathematics, History, etc."
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              />
            </div>

            {/* Topic Entry */}
            <div className="space-y-2">
              <label
                htmlFor="topicEntry"
                className="block text-lg font-medium text-white"
              >
                Enter the Topic
              </label>
              <input
                type="text"
                id="topicEntry"
                name="topicEntry"
                className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="Newton's Laws, Algebra, World War II, etc."
                value={formData.topic}
                onChange={(e) => handleChange("topic", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FaQuestionCircle className="text-[var(--accent-teal)]" />
                <h3 className="text-xl font-semibold text-white">Question Types</h3>
              </div>
              
              <div className="bg-[var(--primary-black)]/40 rounded-xl p-4 border border-[var(--accent-teal)]/10">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-white">
                    <thead>
                      <tr className="border-b border-[var(--accent-teal)]/20">
                        <th className="p-3 text-left">Select</th>
                        <th className="p-3 text-left">Question Type</th>
                        <th className="p-3 text-left">Count</th>
                        <th className="p-3 text-left">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(formData.types).map(([key, value]) => (
                        <tr key={key} className="border-b border-[var(--primary-black)]/40 hover:bg-[var(--primary-black)]/20 transition-colors">
                          {/* Checkbox */}
                          <td className="p-3">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={value.checked}
                                onChange={() => handleCheckboxChange(key)}
                                className="sr-only peer"
                                id={`checkbox-${key}`}
                              />
                              <label 
                                htmlFor={`checkbox-${key}`}
                                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border ${
                                  value.checked 
                                    ? 'bg-[var(--accent-teal)] border-[var(--accent-teal)]' 
                                    : 'bg-[var(--primary-black)]/40 border-gray-600 hover:border-gray-400'
                                } transition-colors`}
                              >
                                {value.checked && <FaCheck className="text-white text-sm" />}
                              </label>
                            </div>
                          </td>

                          {/* Question Type */}
                          <td className="p-3 capitalize">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </td>

                          {/* Count Input */}
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              max="5"
                              placeholder="1-5"
                              value={value.count}
                              onChange={(e) =>
                                handleTypeChange(key, "count", e.target.value)
                              }
                              disabled={!value.checked}
                              className={`w-20 px-3 py-2 rounded-lg ${
                                value.checked
                                  ? "bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)]"
                                  : "bg-[var(--primary-black)]/20 text-gray-500 border border-gray-700 cursor-not-allowed"
                              } transition-all`}
                            />
                          </td>

                          {/* Difficulty Select */}
                          <td className="p-3">
                            <select
                              value={value.difficulty}
                              onChange={(e) =>
                                handleTypeChange(key, "difficulty", e.target.value)
                              }
                              disabled={!value.checked}
                              className={`px-3 py-2 rounded-lg ${
                                value.checked
                                  ? "bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)]"
                                  : "bg-[var(--primary-black)]/20 text-gray-500 border border-gray-700 cursor-not-allowed"
                              } transition-all`}
                            >
                              <option value="Primary">Primary</option>
                              <option value="Secondary">Secondary</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Info message */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/20">
              <FaInfoCircle className="text-[var(--accent-teal)] text-xl mt-1" />
              <p className="text-gray-300">
                Select at least one question type and specify the number of questions (1-5) to generate. 
                Choose the appropriate difficulty level for each question type.
              </p>
            </div>

            {/* Warning Alert */}
            {warning && (
              <div className="p-4 bg-red-500/20 border border-red-600 rounded-xl text-center text-white animate-pulse">
                Please fill in the subject, topic, and select at least one question type with a count.
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
              >
                <span>Generate Questions</span>
                <IoArrowForward />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default QandA;
