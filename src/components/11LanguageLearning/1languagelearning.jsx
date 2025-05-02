import { useState } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import img4 from "../../assets/inputimages/learnlanguage.jpg";
import LoadingSpinner from "../LoadingSpinner"; // Importing the LoadingSpinner component
import SubscriptionCheck from "../Subscription/SubscriptionCheck";

const LanguageSelect = () => {
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
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
      handleSubmit(e);
    }
  };

  // Subscription handlers
  const handleSubscriptionSuccess = () => {
    console.log('Subscription check succeeded, user has API calls available');
    setHasSubscription(true);
  };

  const handleSubscriptionError = (error) => {
    console.error("Subscription check error:", error.message);
    setLoading(false);
  };

  return (
    <SubscriptionCheck
      onSuccess={handleSubscriptionSuccess}
      onError={handleSubscriptionError}
      checkOnMount={true}
    >
      <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Language Learning
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Master a new language with our AI-powered learning assistant
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={img4}
                alt="Language Learning"
                className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                Start Your Language Journey
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-teal-100">
                    Our AI-powered language learning system will guide you through the basics of any language, starting with the alphabet and essential vocabulary.
                  </p>
                
                  {/* Language Input */}
                  <div className="space-y-3 mt-6">
                    <label
                      htmlFor="language"
                      className="block text-lg font-medium text-white"
                    >
                      Which language would you like to learn?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                        placeholder="e.g., Spanish, French, Japanese"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Popular Languages Suggestions */}
                  <div className="pt-2">
                    <p className="text-sm text-teal-100/70 mb-2">Popular choices:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Spanish", "French", "German", "Japanese", "Mandarin"].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setLanguage(lang)}
                          className="px-3 py-1 bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/30 rounded-full text-sm text-white hover:bg-[var(--primary-violet)]/30 transition-all duration-300"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warning Message */}
                  {warning && (
                    <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-3 animate-fadeIn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-white">Please enter a language to continue.</span>
                    </div>
                  )}

                  {/* Submit Button */}
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
                          <span className="mr-2">Start Learning</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
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
    </SubscriptionCheck>
  );
};

export default LanguageSelect;
