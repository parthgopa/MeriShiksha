import React, { useState, useEffect, useCallback } from "react";
import img4 from "../../assets/inputimages/img4.jpg";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";
import "./TopicLearning.css";

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

  const handleChange = useCallback((e) => {
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
  }, []);

  const handleSubmit = useCallback((e) => {
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
  }, [formData, date, time, navigate]);

  const handleEnterPressed = useCallback((e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className="topic-learning-container">
      <div className="topic-learning-content">
        {/* Image Section */}
        <div className="topic-learning-image-section">
          <div className="topic-learning-image-container">
            <div className="topic-learning-image-glow"></div>
            <img
              src={img4}
              alt="Topic Learning"
              className="topic-learning-image"
            />
          </div>
        </div>
        
        {/* Form Section */}
        <div className="topic-learning-form-section">
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleEnterPressed}
            className="topic-learning-form"
          >
            <h2 className="topic-learning-title">
              Topic Learning
            </h2>

            <div className="topic-learning-fields">
              {/* Topic Entry */}
              <div className="topic-learning-field">
                <label
                  htmlFor="topicEntry"
                  className="topic-learning-label"
                >
                  Specify the Topic
                </label>
                <input
                  type="text"
                  id="topicEntry"
                  value={formData.topic}
                  onChange={handleChange}
                  className="topic-learning-input"
                  placeholder="e.g., Algebra, Photosynthesis"
                />
              </div>

              {/* Subject Entry */}
              <div className="topic-learning-field">
                <label
                  htmlFor="subjectEntry"
                  className="topic-learning-label"
                >
                  Enter Related Subject (Optional)
                </label>
                <input
                  type="text"
                  id="subjectEntry"
                  value={formData.subject}
                  onChange={handleChange}
                  className="topic-learning-input"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>

              {/* Parts Entry */}
              <div className="topic-learning-field">
                <label
                  htmlFor="Parts"
                  className="topic-learning-label"
                >
                  Divide Topic into Sections (up to 5)
                </label>
                <input
                  type="number"
                  id="Parts"
                  value={formData.parts}
                  onChange={handleChange}
                  className="topic-learning-input"
                  placeholder="e.g., 3"
                  max="5"
                  min="1"
                />
              </div>

              {/* Submit Button */}
              <div className="topic-learning-submit-container">
                <button
                  type="submit"
                  className="topic-learning-submit-btn"
                >
                  Start Learning
                </button>
              </div>
            </div>

            {warning && (
              <div className="topic-learning-warning">
                Please fill all the required fields!
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Home Button */}
      <div className="topic-learning-home-btn">
        <HomeButton />
      </div>
    </div>
  );
};

export default TopicLearning;
