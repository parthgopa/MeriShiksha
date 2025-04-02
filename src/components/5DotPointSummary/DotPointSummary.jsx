import React, { useState } from "react";
import img5 from "../../assets/inputimages/img5.jpg";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const DotPointSummary = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = e.target[0].value;
    const topic = e.target[1].value;
    // const level = levelentry;

    if (topic && subject) {
      navigate("./summary-page", {
        state: {
          subject: subject,
          topic: topic,
          // level: level,
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

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 md:py-10 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row justify-center items-center gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={img5}
              alt="Dot Point Summary"
              className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
            />
          </div>
        </div>
        
        {/* Form Section */}
        <div className="w-full lg:w-2/3 max-w-2xl">
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-6 md:p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Dot Point Summary
            </h1>
            
            <form
              onSubmit={handleSubmit}
              onKeyDown={handleEnterPressed}
              className="space-y-6"
            >
              {/* Subject Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="SubjectEntry"
                  className="block text-base md:text-lg font-medium text-white"
                >
                  Enter the Subject
                </label>
                <input
                  type="text"
                  id="SubjectEntry"
                  name="SubjectEntry"
                  className="w-full p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                  placeholder="e.g., Mathematics, Physics"
                />
              </div>

              {/* Topic Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="topicEntry"
                  className="block text-base md:text-lg font-medium text-white"
                >
                  Select Topic to Learn
                </label>
                <input
                  type="text"
                  id="topicEntry"
                  name="topicEntry"
                  className="w-full p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                  placeholder="e.g., Rational Numbers, Photosynthesis"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-medium"
                >
                  Generate Summary
                </button>
              </div>
            </form>

            {/* Warning Alert */}
            {warning && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-600 rounded-lg text-center text-white">
                Please fill all the required fields!
              </div>
            )}
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

export default DotPointSummary;
