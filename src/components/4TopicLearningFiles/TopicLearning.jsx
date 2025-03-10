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
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-secondary to-black text-white py-6 md:py-10 px-4 md:px-6 flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-8 overflow-x-hidden">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
        <img
          src={img4}
          alt="Topic Learning"
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
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome to the Topic Learning
          </h2>

          <div className="space-y-4 md:space-y-6">
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
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
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
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
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
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="e.g., 3"
                max="5"
                min="1"
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
          </div>

          {warning && (
            <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-600 rounded-lg text-center text-white">
              Please fill all the required fields!
            </div>
          )}
        </form>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default TopicLearning;
