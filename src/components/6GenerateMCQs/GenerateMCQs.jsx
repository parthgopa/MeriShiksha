import { useRef, useState } from "react";
import img6 from "../../assets/inputimages/img6.jpg";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const GenerateMCQs = () => {
  const [levelentry, setlevelentry] = useState("Primary");
  const [warning, setwarning] = useState(false);
  const navigate = useNavigate();
  const subject = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target[0].value;
    const subject = e.target[1].value;
    const level = levelentry;
    const numMCQs = e.target[3].value;

    if (topic && level && numMCQs) {
      setwarning(false);
      navigate("/questions", {
        state: {
          subject: subject,
          topic: topic,
          level: level,
          numMCQs: numMCQs,
        },
      });
    } else {
      setwarning(true);
    }

    //navigate to questions page.
  };

  const handleLevelChange = (event) => {
    setlevelentry(event.target.value);
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-6 flex flex-col lg:flex-row justify-center items-center gap-8">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 h-auto flex justify-center">
        <img
          src={img6}
          alt="Career Guidance"
          className="w-full h-78 sm:w-2/3 md:w-1/2 lg:w-2/3 sm:h-48 md:h-56 lg:h-auto flex justify-center object-cover rounded-lg shadow-lg"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleEnterPressed}
        className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black"
      >
        <h2
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Generate Multiple Choice Questions
        </h2>

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
            id="topicEntry"
            className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
            placeholder="e.g., Algebra, rockets etc"
          />
        </div>

        {/* Subject Entry */}
        <div className="space-y-2">
          <label
            htmlFor="subjectEntry"
            className="block text-lg font-medium text-white"
          >
            Enter Related Subject (Optional)
          </label>
          <input
            type="text"
            id="subjectEntry"
            ref={subject}
            className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
            placeholder="e.g., Mathematics, Space"
          />
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label
            htmlFor="topicLevel"
            className="block text-lg font-medium text-white"
          >
            Select Difficulty Level
          </label>
          <select
            id="topicLevel"
            value={levelentry}
            onChange={handleLevelChange}
            className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
          >
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Advance">Advance</option>
          </select>
        </div>

        {/* MCQ Count */}
        <div className="space-y-2">
          <label
            htmlFor="mcqCount"
            className="block text-lg font-medium text-white"
          >
            How Many MCQs Do You Want to Generate? (max 10)
          </label>
          <input
            type="number"
            id="mcqCount"
            max="10"
            className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
            placeholder="e.g., 1, 2, ..."
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-info hover:to-black transition-all transform hover:scale-105"
          >
            Submit
          </button>
        </div>

        {/* Warning Message */}
        {warning && (
          <div
            className="mt-6 p-4 bg-teal-500 text-black border border-red-800 rounded-lg text-center text-xl"
            role="alert"
          >
            Please fill all the fields!
          </div>
        )}
      </form>
      <HomeButton />
    </div>
  );
};
export default GenerateMCQs;
