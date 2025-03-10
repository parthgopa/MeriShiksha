import { useNavigate } from "react-router";
import img7 from "../../assets/inputimages/img7.jpg";
import { useState } from "react";
import HomeButton from "../HomeButton";
const CarrierLanguageInput = () => {
  const [levelentry, setlevelentry] = useState("Gujarati");

  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const language = levelentry;

    if (language) {
      navigate("/ai-carrier-guidance", {
        state: {
          language: language,
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
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-6 flex flex-col lg:flex-row justify-center items-center gap-8">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 h-auto flex justify-center">
        <img
          src={img7}
          alt="Career Guidance"
          className="w-full h-70 sm:w-2/3 md:w-1/2 lg:w-2/3 sm:h-48 md:h-56 lg:h-auto flex justify-center object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="max-w-2xl w-full p-8 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
        <h2
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Explore AI Carriers in India
        </h2>
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleEnterPressed}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="topicLevel"
              className="block text-lg font-medium text-white"
            >
              Select Response Language
            </label>
            <select
              id="topicLevel"
              value={levelentry}
              onChange={handleLevelChange}
              className="w-full p-3 rounded-lg bg-secondary text-white focus:ring-2 focus:ring-accent focus:outline-none"
            >
              <option value="Gujarati">Gujarati</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-info hover:bg-black transition-all transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Warning Alert */}
        {warning && (
          <div
            className="mt-6 p-4 bg-teal-600 text-black border border-red-800 rounded-lg items-center justify-center flex text-xl"
            role="alert"
          >
            Please fill all the fields!
          </div>
        )}

        <div className="mt-6">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};
export default CarrierLanguageInput;
