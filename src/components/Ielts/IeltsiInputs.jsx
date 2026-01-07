import { useState } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import img4 from "../../assets/inputimages/ielts-trainer.png";
import LoadingSpinner from "../LoadingSpinner"; // Importing the LoadingSpinner component
import SubscriptionCheck from "../Subscription/SubscriptionCheck";

const IeltsInputs = () => {
  const [examType, setExamType] = useState("Academic");
  const [targetBand, setTargetBand] = useState("7.0");
  const [currentLevel, setCurrentLevel] = useState("Beginner");
  const [takenBefore, setTakenBefore] = useState("no");
  const [previousBand, setPreviousBand] = useState("6.5");
  const [weakestSkill, setWeakestSkill] = useState("Listening");
  const [timeAvailable, setTimeAvailable] = useState("3 months");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!examType || !targetBand || !currentLevel || !takenBefore || !weakestSkill || !timeAvailable) {
      return setWarning(true);
    }

    if (takenBefore === "yes" && !previousBand) {
      return setWarning(true);
    }

    setLoading(true);
    
    let initialPrompt = `
You are a professional IELTS English Language Teacher..

I'm preparing for IELTS ${examType} exam. My details:
- Target band score: ${targetBand}
- Current English level: ${currentLevel}
- Taken IELTS before: ${takenBefore}${takenBefore === "yes" ? ` (Previous band: ${previousBand})` : ""}
- Weakest skill: ${weakestSkill}
- Time available: ${timeAvailable}

Teaching flow :
- Foundation English
- IELTS Listening
- IELTS Reading
- IELTS Writing 
- IELTS Speaking 

Start teaching from the Foundation English section.
Dont give me the week by week plan, just start teaching.
For date: ${date} and time: ${time}(dont display it in output)
`;

    let parts = 5;
    let initialpart = 1;

    let data = {
      initialpart: initialpart,
      examType: examType,
      targetBand: targetBand,
      currentLevel: currentLevel,
      takenBefore: takenBefore,
      previousBand: previousBand,
      weakestSkill: weakestSkill,
      timeAvailable: timeAvailable,
      parts: parts,
      initialPrompt: initialPrompt,
    };
    
    setWarning(false);
    console.log(data)
    navigate("/ielts-learning-parts", { state: data });
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
    
      <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            IELTS Trainer
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Personalized IELTS preparation with AI-powered learning assistant
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
                Start Your IELTS Preparation
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-teal-100">
                    Our AI-powered IELTS trainer will create a personalized study plan based on your current level and target score.
                  </p>
                
                  {/* Exam Type */}
                  <div className="space-y-3 mt-6">
                    <label className="block text-lg font-medium text-white">
                      1. IELTS exam type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Academic", "General Training"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setExamType(type)}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 font-medium ${
                            examType === type
                              ? "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] border-[var(--accent-teal)] text-white shadow-lg shadow-[var(--accent-teal)]/25"
                              : "bg-[var(--primary-black)]/60 border-[var(--accent-teal)]/40 text-teal-100 hover:bg-[var(--primary-violet)]/30 hover:border-[var(--accent-teal)]/60"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Band Score */}
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">
                      2. Target band score
                    </label>
                    <select
                      value={targetBand}
                      onChange={(e) => setTargetBand(e.target.value)}
                      className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                    >
                      <option value="">Select target band</option>
                      {["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"].map((band) => (
                        <option key={band} value={band}>{band}</option>
                      ))}
                    </select>
                  </div>

                  {/* Current English Level */}
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">
                      3. Current English level
                    </label>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                    >
                      <option value="">Select your level</option>
                      {["Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* IELTS Taken Before */}
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">
                      4. IELTS taken before?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {["yes", "no"].map((answer) => (
                        <button
                          key={answer}
                          type="button"
                          onClick={() => {
                            setTakenBefore(answer);
                            if (answer === "no") setPreviousBand("");
                          }}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 font-medium capitalize ${
                            takenBefore === answer
                              ? "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] border-[var(--accent-teal)] text-white shadow-lg shadow-[var(--accent-teal)]/25"
                              : "bg-[var(--primary-black)]/60 border-[var(--accent-teal)]/40 text-teal-100 hover:bg-[var(--primary-violet)]/30 hover:border-[var(--accent-teal)]/60"
                          }`}
                        >
                          {answer}
                        </button>
                      ))}
                    </div>
                    {takenBefore === "yes" && (
                      <input
                        type="text"
                        value={previousBand}
                        onChange={(e) => setPreviousBand(e.target.value)}
                        className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300 mt-3"
                        placeholder="Previous band score (e.g., 6.5)"
                      />
                    )}
                  </div>

                  {/* Weakest Skill */}
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">
                      5. Weakest skill
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Listening", "Reading", "Writing", "Speaking"].map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => setWeakestSkill(skill)}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 font-medium ${
                            weakestSkill === skill
                              ? "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] border-[var(--accent-teal)] text-white shadow-lg shadow-[var(--accent-teal)]/25"
                              : "bg-[var(--primary-black)]/60 border-[var(--accent-teal)]/40 text-teal-100 hover:bg-[var(--primary-violet)]/30 hover:border-[var(--accent-teal)]/60"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Available */}
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">
                      6. Time available before exam
                    </label>
                    <input
                      type="text"
                      value={timeAvailable}
                      onChange={(e) => setTimeAvailable(e.target.value)}
                      className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                      placeholder="e.g., 4 weeks, 2 months, 3 months"
                    />
                  </div>

                  {/* Warning Message */}
                  {warning && (
                    <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-3 animate-fadeIn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-white">Please fill in all required fields to continue.</span>
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
                          <span className="mr-2">Start IELTS Training</span>
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
  );
};

export default IeltsInputs;
