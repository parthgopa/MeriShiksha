import React, { useState } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import { IoArrowForward } from "react-icons/io5";
import { FaGraduationCap, FaBook, FaQuestionCircle, FaChalkboardTeacher } from "react-icons/fa";
import "./GenerateMCQs.css";

const GenerateMCQs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    level: "Primary",
    numMCQs: "5"
  });
  const [warning, setWarning] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'SubjectEntry': 'subject',
      'topicEntry': 'topic',
      'levelEntry': 'level',
      'numMCQsEntry': 'numMCQs'
    };
    
    setFormData(prev => ({
      ...prev,
      [fieldMap[id] || id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (formData.subject && formData.topic) {
      navigate("/generate-mcqs/questions", {
        state: {
          subject: formData.subject,
          topic: formData.topic,
          level: formData.level,
          numMCQs: formData.numMCQs,
          comingfrom: "FromQuizPlay"
        },
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
    <div className="mcq-container">
      <div className="mcq-content">
        <div className="mcq-form-card">
          <h2 className="mcq-title">
            Generate Multiple Choice Questions
          </h2>

          <form
            onSubmit={handleSubmit}
            onKeyDown={handleEnterPressed}
            className="mcq-form"
          >
              {/* Subject Entry */}
              <div className="mcq-form-group">
                <label
                  htmlFor="SubjectEntry"
                  className="mcq-label"
                >
                  Subject
                </label>
                <input
                  type="text"
                  className="mcq-input"
                  id="SubjectEntry"
                  placeholder="Physics, Mathematics, History, etc."
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              {/* Topic Entry */}
              <div className="mcq-form-group">
                <label
                  htmlFor="topicEntry"
                  className="mcq-label"
                >
                  Topic
                </label>
                <input
                  type="text"
                  className="mcq-input"
                  id="topicEntry"
                  placeholder="Gravity, Algebra, World War II, etc."
                  value={formData.topic}
                  onChange={handleChange}
                />
              </div>

              {/* Level Selection */}
              <div className="mcq-form-group">
                <label
                  htmlFor="levelEntry"
                  className="mcq-label"
                >
                  Difficulty Level
                </label>
                <select
                  className="mcq-select"
                  id="levelEntry"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="High School">High School</option>
                  <option value="College Level">College Level</option>
                </select>
              </div>

              {/* Number of MCQs */}
              <div className="mcq-form-group">
                <label
                  htmlFor="numMCQsEntry"
                  className="mcq-label"
                >
                  Number of Questions
                </label>
                <select
                  className="mcq-select"
                  id="numMCQsEntry"
                  value={formData.numMCQs}
                  onChange={handleChange}
                >
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="7">7 Questions</option>
                  <option value="10">10 Questions</option>
                </select>
              </div>

              {warning && (
                <div className="mcq-warning">
                  Please enter both subject and topic.
                </div>
              )}

              {/* Submit Button */}
              <div className="mcq-submit-container">
                <button
                  type="submit"
                  className="mcq-submit-btn"
                >
                  <span>Generate Questions</span>
                  <IoArrowForward />
                </button>
              </div>
            </form>
        </div>
      </div>
      
      {/* Home Button */}
      <div className="mcq-home-btn">
        <HomeButton />
      </div>
    </div>
  );
};

export default GenerateMCQs;
