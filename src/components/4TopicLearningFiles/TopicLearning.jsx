import React, { useState, useEffect } from "react";
import img4 from "../../assets/inputimages/img4.jpg";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";

const TopicLearning = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    topic: "",
    subject: "",
    parts: ""
  });
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('topicLearningFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Create a mapping for the field IDs
    const fieldMap = {
      'topicEntry': 'topic',
      'subjectEntry': 'subject',
      'Parts': 'parts'
    };
    
    setFormData(prev => {
      const fieldName = fieldMap[id] || id;
      const newData = { ...prev, [fieldName]: value };
      localStorage.setItem('topicLearningFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let initialPrompt = `
    You are my mentor.
    I am a begineer in the topic : '${formData.topic}' ${
      formData.subject && `in the  subject :'${formData.subject}'`
    } . Provide knowledge-based content and in depth,Start by providing an introduction that defines the topic and explains its significance. Then, break down key concepts, principles, and theories related to this topic. Include real-world examples, applications, and practical use cases where applicable. Also, mention any historical background or evolution of the topic if relevant. Discuss common challenges, misconceptions, and limitations. Provide step-by-step explanations of any processes, formulas, or frameworks related to this topic. Finally, summarize the key takeaways and suggest additional resources (books, websites, or research papers) for further learning. Ensure the explanation is clear and beginner-friendly, using simple language and analogies where necessary. Cover the key points and relevance of :${formData.topic} in a way suitable for a student and/or teacher.
    When the topic pertains to any law of India, please provide specific references of the relevant sections, rules, and regulations of the particular act, along with any case laws or judicial precedents if any.
    For date: ${date} and time: ${time}(dont display it in output)
    `;

    let data = {
      ...formData,
      initialPrompt
    };

    if (formData.topic && formData.parts) {
      setWarning(false);
      navigate("/learning-topic", { state: data });
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 md:py-10 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row justify-center items-center gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={img4}
              alt="Topic Learning"
              className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
            />
          </div>
        </div>
        
        {/* Form Section */}
        <div className="w-full lg:w-2/3 max-w-2xl">
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleEnterPressed}
            className="w-full mb-5 p-6 md:p-8 rounded-xl shadow-2xl bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 border border-[var(--accent-teal)]/10 backdrop-blur-sm"
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]"
            >
              Topic Learning
            </h2>

            <div className="space-y-6">
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
                  id="topicEntry"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                  placeholder="e.g., Algebra, Photosynthesis"
                />
              </div>

              {/* Subject Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="subjectEntry"
                  className="block text-base md:text-lg font-medium text-white"
                >
                  Enter Related Subject (Optional)
                </label>
                <input
                  type="text"
                  id="subjectEntry"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>

              {/* Parts Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="Parts"
                  className="block text-base md:text-lg font-medium text-white"
                >
                  Divide Topic into Sections (up to 5)
                </label>
                <input
                  type="number"
                  id="Parts"
                  value={formData.parts}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all"
                  placeholder="e.g., 3"
                  max="5"
                  min="1"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-medium"
                >
                  Start Learning
                </button>
              </div>
            </div>

            {warning && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-600 rounded-lg text-center text-white">
                Please fill all the required fields!
              </div>
            )}
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

export default TopicLearning;
