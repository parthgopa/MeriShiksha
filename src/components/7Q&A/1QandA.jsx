import React, { useState } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

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
        // console.log(key.toLowerCase());

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
    console.log(prompt);

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
    }

    return prompt;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = e.target[0].value;
    const topic = e.target[1].value;

    if (subject && topic) {
      navigate("/q-and-a/2page", {
        state: {
          subject: subject,
          topic: topic,
        },
      });
    } else {
      setWarning(true);
    }
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      generatePrompt;
    }
  };
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex justify-center items-center">
      <div className="max-w-2xl w-full p-8 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
        <h2
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Questions & Answers
        </h2>
        <form
          onSubmit={generatePrompt}
          onKeyDown={handleEnterPressed}
          className="space-y-6"
        >
          {/* Subject Entry */}
          <div className="space-y-2">
            <label
              htmlFor="SubjectEntry"
              className="block text-lg font-medium text-white"
            >
              Enter the Subject to study
            </label>
            <input
              type="text"
              id="SubjectEntry"
              name="SubjectEntry"
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="Gravity, rockets, biopics, etc."
            />
          </div>

          {/* Topic Entry */}
          <div className="space-y-2">
            <label
              htmlFor="topicEntry"
              className="block text-lg font-medium text-white"
            >
              Enter the Topic in Subject
            </label>
            <input
              type="text"
              id="topicEntry"
              name="topicEntry"
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="Newton's Law, Momentum, etc."
            />
          </div>

          <table className="w-full border-collapse border border-gray-300 text-white">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-2 border border-gray-500">Select</th>
                <th className="p-2 border border-gray-500">Question Type</th>
                <th className="p-2 border border-gray-500">Count</th>
                <th className="p-2 border border-gray-500">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData.types).map(([key, value]) => (
                <tr key={key} className="bg-gray-800">
                  {/* Checkbox */}
                  <td className="p-2 border border-gray-500 text-center">
                    <input
                      type="checkbox"
                      checked={value.checked}
                      onChange={() => handleCheckboxChange(key)}
                      className={`rounded text-blue-600 focus:ring-blue-500  ${
                        value.checked
                          ? "w-4 h-4"
                          : "opacity-50 bg-blue-500 h-4 w-4"
                      }`}
                    />
                  </td>

                  {/* Question Type */}
                  <td className="p-2 border border-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </td>

                  {/* Count Input */}
                  <td className="p-2 border border-gray-500">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Count"
                      value={value.count}
                      onChange={(e) =>
                        handleTypeChange(key, "count", e.target.value)
                      }
                      disabled={!value.checked}
                      className={`w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        value.checked
                          ? "border-gray-300"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    />
                  </td>

                  {/* Difficulty Select */}
                  <td className="p-2 border border-gray-500">
                    <select
                      value={value.difficulty}
                      onChange={(e) =>
                        handleTypeChange(key, "difficulty", e.target.value)
                      }
                      disabled={!value.checked}
                      className={`px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        value.checked
                          ? "border-gray-300"
                          : "bg-gray-400 cursor-not-allowed"
                      }
                      `}
                    >
                      <option value="">Select Level</option>
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-info hover:bg-black transition-all transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Warning Alert */}
        {warning && (
          <div
            className="mt-6 p-4 bg-teal-600 text-black border border-red-800 rounded-lg items-center justify-center flex text-xl"
            role="alert"
          >
            Please fill all the fields!
          </div>
        )}

        <div className="mt-6">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};
export default QandA;
