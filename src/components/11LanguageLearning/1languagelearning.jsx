import { useState } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import img4 from "../../assets/inputimages/learnlanguage.jpg";
import LoadingSpinner from "../LoadingSpinner"; // Importing the LoadingSpinner component

const LanguageSelect = () => {
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!language.trim()) return setWarning(true);

    setLoading(true);
    let initialPrompt = `I'm learning ${language} language. I'm a complete beginner.

1. Alphabet learning:
Provide the sounds and shapes of the alphabets in ${language} language by reviewing each letter and its pronunciation. Following format: Letter, Shape, Pronunciation (approximate), Example Word, Example Word Translation, Notes.

Provide the output in bullet points.
For example, in Spanish, the letter 'A' is pronounced like 'ah'.
For date: ${date} and time: ${time}(dont display it in output)
`;

    let parts = 7;
    let initialpart = 1;

    let data = {
      initialpart: initialpart,
      language: language,
      parts: parts,
      initialPrompt: initialPrompt,
    };
    if (language) {
      setWarning(false);
      navigate("/learning-parts", { state: data });
    } else {
      setWarning(true);
    }
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-6 flex flex-col lg:flex-row justify-center items-center gap-8">
      <div className="w-full lg:w-1/3 h-auto flex justify-center">
        <img
          src={img4}
          alt="Career Guidance"
          className="w-full h-92 sm:w-2/3 md:w-1/2 lg:w-2/3 sm:h-48 md:h-56 lg:h-auto flex justify-center object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="max-w-xl w-full p-8 rounded-lg shadow-lg bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-700">
        <h2 className="text-3xl text-white font-bold text-center mb-6">
          Learn a Language
        </h2>
        <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
          {/* Language Input */}
          <div className="space-y-4">
            <label
              htmlFor="language"
              className="block text-lg text-white font-medium"
            >
              Enter the Language
            </label>
            <input
              type="text"
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Spanish, French, German"
            />
          </div>

          {/* Continue Button */}
          <div className="text-center mt-6">
            <button
              className="btn btn-info hover:bg-blue-600 transition-all transform hover:scale-105 px-6 py-3 rounded-lg text-lg font-semibold"
              disabled={loading}
            >
              Continue
            </button>
          </div>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-4">
            <LoadingSpinner />
          </div>
        )}
        {/* Warning Alert */}
        {warning && (
          <div
            className="mt-6 p-4 bg-teal-600 text-black border border-red-800 rounded-lg items-center justify-center flex text-xl"
            role="alert"
          >
            Please fill all the fields!
          </div>
        )}
      </div>
      <HomeButton></HomeButton>
    </div>
  );
};

export default LanguageSelect;
