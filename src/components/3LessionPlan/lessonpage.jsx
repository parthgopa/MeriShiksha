import React, { useState, useEffect } from "react";
import img3 from "../../assets/inputimages/img3.jpg";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";

const LessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    time: ""
  });
  const [warning, setWarning] = useState(false);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('lessonFormData');
    console.log(savedData);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'SubjectEntry': 'subject',
      'topicEntry': 'topic',
      'durationEntry': 'time'
    };
    
    setFormData(prev => {
      const newData = { ...prev, [fieldMap[id]]: value };
      localStorage.setItem('lessonFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.subject && formData.topic && formData.time) {
      navigate("/lessonpage/planned-page", {
        state: formData
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
          src={img3}
          alt="Lesson Planning"
          className="w-3/4 sm:w-1/2 md:w-2/5 lg:w-4/5 h-auto object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-2/3 max-w-2xl">
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleEnterPressed}
          className="w-full mb-5 p-4 md:p-6 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-white">
            Strategize Your Learning Path
          </h2>

          <div className="space-y-4 md:space-y-6">
            {/* Subject Entry */}
            <div className="space-y-2">
              <label
                htmlFor="SubjectEntry"
                className="block text-base md:text-lg font-medium text-white"
              >
                Enter Your Subject
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                id="SubjectEntry"
                placeholder="Gravity, rockets, biopics, etc."
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            {/* Topic Entry */}
            <div className="space-y-2">
              <label
                htmlFor="topicEntry"
                className="block text-base md:text-lg font-medium text-white"
              >
                Specify the Topic
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                id="topicEntry"
                placeholder="Newton's Law, Momentum, etc."
                value={formData.topic}
                onChange={handleChange}
              />
            </div>

            {/* Study Duration */}
            <div className="space-y-2">
              <label
                htmlFor="durationEntry"
                className="block text-base md:text-lg font-medium text-white"
              >
                Set Your Study Duration
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                id="durationEntry"
                placeholder="60 minutes, 5 days, etc."
                value={formData.time}
                onChange={handleChange}
              />
            </div>

            {warning && (
              <div className="p-3 bg-red-500 bg-opacity-20 border border-red-600 rounded-lg text-center text-white">
                Please fill in all fields.
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg btn btn-info"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default LessonPage;
