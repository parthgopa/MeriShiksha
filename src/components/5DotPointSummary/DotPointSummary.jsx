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
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-secondary to-black text-white py-6 md:py-10 px-4 md:px-6 flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-8 overflow-x-hidden">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
        <img
          src={img5}
          alt="Dot Point Summary"
          className="w-3/4 sm:w-1/2 md:w-2/5 lg:w-4/5 h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
      
      {/* Form Section */}
      <div className="w-full lg:w-2/3 max-w-2xl">
        <div className="w-full mb-5 p-4 md:p-6 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Dot Point Summary
          </h2>
          
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleEnterPressed}
            className="space-y-4 md:space-y-6"
          >
            {/* Subject Entry */}
            <div className="space-y-2">
              <label
                htmlFor="SubjectEntry"
                className="block text-base md:text-lg font-medium text-white"
              >
                Enter the subject
              </label>
              <input
                type="text"
                id="SubjectEntry"
                name="SubjectEntry"
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
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
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="e.g., Rational Numbers, Photosynthesis"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg btn btn-info"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Warning Alert */}
          {warning && (
            <div
              className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-600 rounded-lg text-center text-white"
              role="alert"
            >
              Please fill all the fields!
            </div>
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

export default DotPointSummary;
