import React, { useState } from "react";
import img3 from "../../assets/inputimages/ailabassistant.jpg";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import { IoFlaskOutline, IoSendSharp } from "react-icons/io5";

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
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            AI Lab Assistant
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Get detailed lab procedures and reports for your experiments
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={img3}
                alt="Lab Assistant"
                className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                Get Your Lab Report
              </h2>
              
              <form
                onSubmit={handleSubmit}
                onKeyDown={handleEnterPressed}
                className="space-y-6"
              >


                <div className="space-y-4">
                  <p className="text-teal-100">
                    Our AI-powered lab assistant will guide you through experiments and generate detailed lab reports.
                  </p>
                
                  {/* Topic Entry */}
                  <div className="space-y-3 mt-6">
                    <label
                      htmlFor="topicEntry"
                      className="block text-lg font-medium text-white"
                    >
                      Specify the Experiment Topic
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                        id="topicEntry"
                        placeholder="Titration, Ohm's Law, Potentiometer..."
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <IoFlaskOutline className="h-5 w-5 text-[var(--accent-teal)]" />
                      </div>
                    </div>
                  </div>

                  {/* Method Selection */}
                  <div className="space-y-3 mt-4">
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
                      className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                    >
                      <option value="general">General Process</option>
                      <option value="specific">Specific Process</option>
                    </select>
                  </div>

                  {/* Conditional Specific Method Input */}
                  {methodType === "specific" && (
                    <div className="space-y-3 mt-4">
                      <label
                        htmlFor="specificMethod"
                        className="block text-lg font-medium text-white"
                      >
                        Specify the Method
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                          id="specificMethod"
                          placeholder="Describe the specific method or procedure..."
                          value={specificMethod}
                          onChange={(e) => setSpecificMethod(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Warning Message */}
                  {warning && (
                    <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-3 animate-fadeIn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-white">Please fill all required fields.</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-lg transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                    >
                      <span className="mr-2">Generate Lab Report</span>
                      <IoSendSharp className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default LabAssistant;
