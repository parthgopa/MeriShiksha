import { useNavigate } from "react-router";
import img7 from "../../assets/inputimages/img7.jpg";
import { useState } from "react";
import HomeButton from "../HomeButton";
import "./QuizPlay.css";
const QuizPlay = () => {
  const [levelentry, setlevelentry] = useState("Primary");

  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = e.target[0].value;
    const topic = e.target[1].value;
    const level = levelentry;
    const numMCQs = e.target[3].value;
    const comingfrom = "FromQuizPlay";
    // console.log(subject, topic, level, numMCQs);

    console.log(subject, topic, level, numMCQs, comingfrom);
    if (subject && topic && level && numMCQs) {
      navigate("/generate-mcqs/quiz", {
        state: {
          subject: subject,
          topic: topic,
          level: level,
          numMCQs: numMCQs,
          comingfrom: comingfrom,
        },
      });
    } else {
      setWarning(true);
    }
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };
  const handleLevelChange = (e) => {
    setlevelentry(e.target.value);
  };
  return (
    <div className="quiz-play-container">
      <div className="quiz-play-content">
        {/* Image Section */}
        <div className="quiz-play-image-section">
          <div className="quiz-play-image-container">
            <img
              src={img7}
              alt="Quiz Play"
              className="quiz-play-image"
            />
          </div>
        </div>
        
        {/* Form Section */}
        <div className="quiz-play-form-section">
          <div className="quiz-play-form-card">
            <h2 className="quiz-play-title">
              Quiz Play
            </h2>
            
            <form
              onSubmit={handleSubmit}
              onKeyDown={handleEnterPressed}
              className="quiz-play-form"
            >
              {/* Subject Entry */}
              <div className="quiz-play-field">
                <label
                  htmlFor="SubjectEntry"
                  className="quiz-play-label"
                >
                  Enter Your Subject
                </label>
                <input
                  type="text"
                  id="SubjectEntry"
                  name="SubjectEntry"
                  className="quiz-play-input"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>

              {/* Topic Entry */}
              <div className="quiz-play-field">
                <label
                  htmlFor="topicEntry"
                  className="quiz-play-label"
                >
                  Specify the Topic
                </label>
                <input
                  type="text"
                  id="topicEntry"
                  name="topicEntry"
                  className="quiz-play-input"
                  placeholder="e.g., Numbers, Photosynthesis"
                />
              </div>

              {/* Difficulty Level */}
              <div className="quiz-play-field">
                <label
                  htmlFor="topicLevel"
                  className="quiz-play-label"
                >
                  Select Difficulty Level
                </label>
                <select
                  id="topicLevel"
                  value={levelentry}
                  onChange={handleLevelChange}
                  className="quiz-play-select"
                >
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Advance">Advance</option>
                </select>
              </div>

              {/* Number of MCQs */}
              <div className="quiz-play-field">
                <label
                  htmlFor="NumberofMCQEntry"
                  className="quiz-play-label"
                >
                  How many MCQs would you like to generate? (max 15)
                </label>
                <input
                  type="number"
                  id="NumberofMCQEntry"
                  name="NumberofMCQEntry"
                  className="quiz-play-input"
                  placeholder="e.g., 5"
                  min="1"
                  max="15"
                />
              </div>

              {/* Submit Button */}
              <div className="quiz-play-submit-container">
                <button
                  type="submit"
                  className="quiz-play-submit-btn"
                >
                  Start Quiz
                </button>
              </div>
            </form>

            {/* Warning Alert */}
            {warning && (
              <div
                className="quiz-play-warning"
                role="alert"
              >
                Please fill all the fields!
              </div>
            )}

            <div className="quiz-play-home-container">
              <HomeButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizPlay;
