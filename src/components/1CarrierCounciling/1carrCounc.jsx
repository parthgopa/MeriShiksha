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

    console.log(interest);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Career Counselling
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Discover your ideal career path based on your interests and skills with our AI-powered career guidance.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={img1}
                alt="Career Guidance"
                className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
              <form
                onSubmit={handleSubmit}
                onKeyDown={handleEnterPressed}
                className="space-y-6"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                  Unlock Your Potential
                </h2>

                {/* Interest Entry */}
                <div className="space-y-3">
                  <label
                    htmlFor="InterestEntry"
                    className="block text-lg font-medium text-white"
                  >
                    What field interests you?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="InterestEntry"
                      name="InterestEntry"
                      className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                      placeholder="e.g., Chemical Engineering, Chartered Accountant, Dancing"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-teal-100/70 italic">
                    Write your area of interest (e.g., Computer Engineering, Law, Dance, Finance)
                  </p>
                </div>

                {/* Language Selection */}
                <div className="space-y-3">
                  <label
                    htmlFor="languageSelect"
                    className="block text-lg font-medium text-white"
                  >
                    Select Response Language
                  </label>
                  <div className="relative">
                    <select
                      id="languageSelect"
                      value={languageentry}
                      onChange={handleLanguageChange}
                      className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none appearance-none transition-all duration-300"
                    >
                      <option value="Gujarati">Gujarati</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                {warning && (
                  <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-3 animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-white">Please enter your interests for career planning.</span>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-lg transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                  >
                    {loading ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <span className="mr-2">Generate Career Guidance</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
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

export default CarrierCounciling;
