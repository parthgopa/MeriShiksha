import React, { useState, useEffect } from "react";
import img3 from "../../assets/inputimages/img3.jpg";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";
import { IoArrowForward } from "react-icons/io5";

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
      setTimeout(() => setWarning(false), 3000);
    }
  };

  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src={img3}
              alt="Lesson Planning"
              className="relative w-3/4 sm:w-1/2 md:w-2/5 lg:w-4/5 h-auto object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-2/3 max-w-2xl">
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Strategize Your Learning Path
            </h2>

            <form
              onSubmit={handleSubmit}
              onKeyDown={handleEnterPressed}
              className="space-y-6"
            >
              {/* Subject Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="SubjectEntry"
                  className="block text-lg font-medium text-white"
                >
                  Enter Your Subject
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
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
                  className="block text-lg font-medium text-white"
                >
                  Specify the Topic
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
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
                  className="block text-lg font-medium text-white"
                >
                  Set Your Study Duration
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
                  id="durationEntry"
                  placeholder="60 minutes, 5 days, etc."
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              {warning && (
                <div className="p-4 bg-red-500/20 border border-red-600 rounded-xl text-center text-white animate-pulse">
                  Please fill in all fields.
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                >
                  <span>Create Lesson Plan</span>
                  <IoArrowForward />
                </button>
              </div>
            </form>
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

export default LessonPage;
