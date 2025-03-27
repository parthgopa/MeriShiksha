import { useState } from "react";
import img1 from "../../assets/inputimages/img1.jpg";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";
import APIService from "../API";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

const CarrierCounciling = () => {
  const [loading, setLoading] = useState(false);
  const [carriercounciling, setcarriercounciling] = useState("");
  const [interest, setInterest] = useState("");
  const [warning, setWarning] = useState(false);
  const [languageentry, setlanguageentry] = useState("English");

  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const interest = e.target[0].value;
    setInterest(interest);

    if (!interest) {
      setWarning(true);
      return;
    }

    const prompt = `Based on my interest in ${interest}, suggest the top 5 career options that will be in demand after 4 years. Provide the following details for each career option:

- Career overview
- Key responsibilities
- Required skills and qualifications
- Relevant courses or certifications
- Name of reputed Indian colleges/institutes/universities with their website details

Consider factors like job market demand, growth prospects, and potential salary ranges. 
Provide the output in a concise bullet-point list format and in ${languageentry} language.
For date: ${date} and time: ${time}(dont display it in output)`;

    setLoading(true);
    APIService({ question: prompt, onResponse: handleOnResponse });
  };

  const handleOnResponse = (response) => {
    try {
      const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        setcarriercounciling(content);
        setLoading(false);

        navigate("/carrier-counselling/output", {
          state: { response: content },
        });
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("Failed to generate Counciling. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  
  const handleLanguageChange = (e) => {
    setlanguageentry(e.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-secondary to-black text-white py-6 md:py-10 px-4 md:px-6 flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-8 overflow-x-hidden">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
        <img
          src={img1}
          alt="Career Guidance"
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
            Unlock your potential with expert guidance
          </h2>

          <div className="space-y-4 md:space-y-6">
            {/* Interest Entry */}
            <div className="space-y-2">
              <label
                htmlFor="InterestEntry"
                className="block text-base md:text-lg lg:text-xl font-medium text-white"
              >
                Enter your interested field
              </label>
              <input
                type="text"
                id="InterestEntry"
                name="InterestEntry"
                className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="e.g., Chemical Engineering, Chartered Accountant, Dancing"
              />
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-gray-300 italic">
              (Write your career planning. e.g., Computer Engineering, Electronics
              Engineering, Architecture, Dancing, Law, etc.)
            </p>

            {/* Language Selection */}
            <div className="space-y-2">
              <label
                htmlFor="topicLevel"
                className="block text-base md:text-lg font-medium text-white"
              >
                Select Response Language
              </label>
              <select
                id="topicLevel"
                value={languageentry}
                onChange={handleLanguageChange}
                className="w-full p-3 rounded-lg bg-secondary text-white focus:ring-2 focus:ring-accent focus:outline-none"
              >
                <option value="Gujarati">Gujarati</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
              </select>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center my-4">
                <LoadingSpinner />
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg btn btn-info"
                disabled={loading}
              >
                Generate
              </button>
            </div>
          </div>
        </form>

        {/* Warning */}
        {warning && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-600 rounded-lg text-center text-white">
            Please enter your interests for career planning.
          </div>
        )}
      </div>

      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default CarrierCounciling;
