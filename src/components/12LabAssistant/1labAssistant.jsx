import React, { useState } from "react";
import img3 from "../../assets/inputimages/ailabassistant.jpg";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const LabAssistant = () => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const [methodType, setMethodType] = useState("general"); // Changed from methodentry
  const [specificMethod, setSpecificMethod] = useState(""); // New state for specific method input

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    // Determine which method to send based on selection
    const method = methodType === "general" ? "general" : specificMethod;

    if (
      topic &&
      (methodType === "general" ||
        (methodType === "specific" && specificMethod))
    ) {
      // console.log(topic, method);
      navigate("/lab-report", {
        state: {
          topic: topic,
          method: method,
        },
      });
    } else {
      setWarning(true);
    }
  };

  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleMethodChange = (e) => {
    setMethodType(e.target.value);
    if (e.target.value === "general") {
      setSpecificMethod(""); // Reset specific method when switching to general
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-6 flex flex-col lg:flex-row justify-center items-center gap-8">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 h-auto flex justify-center">
        <img
          src={img3}
          alt="Career Guidance"
          className="w-full h-75 sm:w-2/3 md:w-1/2 lg:w-2/3 sm:h-48 md:h-56 lg:h-auto flex justify-center object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleEnterPressed}
        className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Get Your AI Lab Assistant
        </h2>

        {/* Topic Entry */}
        <div className="form-group">
          <label
            htmlFor="topicEntry"
            className="block text-sm font-medium text-white mb-2"
          >
            Specify the Topic
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
            id="topicEntry"
            placeholder="Titration, Ohm's Law, Potentiometer."
          />
        </div>

        {/* Method Selection */}
        <div className="space-y-2">
          <label
            htmlFor="methodType"
            className="block text-lg font-medium text-white"
          >
            Select Method Type
          </label>
          <select
            id="methodType"
            value={methodType}
            onChange={handleMethodChange}
            className="w-full p-3 rounded-lg bg-secondary text-white focus:ring-2 focus:ring-accent focus:outline-none"
          >
            <option value="general">General Process</option>
            <option value="specific">Specific Process</option>
          </select>
        </div>

        {/* Conditional Specific Method Input */}
        {methodType === "specific" && (
          <div className="form-group">
            <label
              htmlFor="specificMethod"
              className="block text-sm font-medium text-white mb-2"
            >
              Specify the Method
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              id="specificMethod"
              placeholder="Specify the method here"
              value={specificMethod}
              onChange={(e) => setSpecificMethod(e.target.value)}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-info focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Submit
          </button>
        </div>
        {warning && (
          <div className="mt-6 p-4 bg-teal-600 text-white rounded-lg text-center">
            Please fill all details !
          </div>
        )}
      </form>

      <HomeButton />
    </div>
  );
};

export default LabAssistant;
