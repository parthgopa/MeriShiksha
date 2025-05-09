import React, { useState, useEffect } from "react";
import img4 from "../../assets/inputimages/mockinterview.jpg";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import SubscriptionCheck from "../Subscription/SubscriptionCheck";

const MockInterview = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    educationQualifications: "",
    pastWorkExperience: "",
    currentWorkExperience: "",
    coreSkills: "",
    companyName: "",
    companyType: "",
    interviewPost: "",
    postNature: "",
  });
  const [workExperiences, setWorkExperiences] = useState([
    { companyName: "", years: "", description: "" },
  ]);
  const [currentExperience, setCurrentExperience] = useState({
    companyName: "",
    years: "",
    description: "",
  });
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();
  const date = new Date().toDateString();
  const time = new Date().toTimeString();
  const [hasSubscription, setHasSubscription] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("mockInterviewFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));

      // Extract current experience if it exists in saved data
      const savedFormData = JSON.parse(savedData);
      if (savedFormData.currentWorkExperience) {
        const match =
          savedFormData.currentWorkExperience.match(/(\d+) years at (.+)/);
        if (match) {
          setCurrentExperience({
            years: match[1] || "",
            companyName: match[2] || "",
          });
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      localStorage.setItem("mockInterviewFormData", JSON.stringify(newData));
      return newData;
    });
  };

  const handleCurrentExperienceChange = (field, value) => {
    setCurrentExperience((prev) => {
      const newExp = { ...prev, [field]: value };

      // Update the currentWorkExperience in formData
      const formattedExperience =
        newExp.companyName || newExp.years || newExp.description
          ? `Working with ${newExp.companyName || "N/A"} for ${
              newExp.years || "0"
            } years, job description: ${newExp.description || "N/A"}`
          : "";

      setFormData((prev) => {
        const newData = { ...prev, currentWorkExperience: formattedExperience };
        localStorage.setItem("mockInterviewFormData", JSON.stringify(newData));
        return newData;
      });

      return newExp;
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...workExperiences];
    newExperiences[index][field] = value;
    setWorkExperiences(newExperiences);

    // Update the pastWorkExperience in formData
    const formattedExperience = newExperiences
      .filter((exp) => exp.companyName || exp.years || exp.description)
      .map(
        (exp) =>
          `${exp.years} years at ${exp.companyName} , job description : ${exp.description}`
      )
      .join("; ");

    setFormData((prev) => ({
      ...prev,
      pastWorkExperience: formattedExperience || "FRESHER",
    }));
  };

  const addExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      { companyName: "", years: "", description: "" },
    ]);
  };

  const removeExperience = (index) => {
    const newExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(newExperiences);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a copy of formData for validation
    const dataToValidate = { ...formData };

    // If user is a fresher (no work experience), set default values
    if (
      !dataToValidate.currentWorkExperience &&
      !dataToValidate.pastWorkExperience
    ) {
      dataToValidate.currentWorkExperience = "FRESHER";
      dataToValidate.pastWorkExperience = "FRESHER";

      // Update the actual formData
      setFormData((prev) => ({
        ...prev,
        currentWorkExperience: "FRESHER",
        pastWorkExperience: "FRESHER",
      }));
    }

    // Check if required fields are filled
    const requiredFields = [
      "fullName",
      "educationQualifications",
      "coreSkills",
      "companyName",
      "companyType",
      "interviewPost",
      "postNature",
    ];
    const allRequiredFieldsFilled = requiredFields.every((field) =>
      dataToValidate[field]?.trim()
    );

    let initialPrompt = `
    You are my interviewer.
    You will create a simulation of my interview for the post of ${
      formData.interviewPost
    }.
    Here is my basic information:
    1. Name: ${formData.fullName}
    2. Educational Qualifications: ${formData.educationQualifications}
    4. Past Work Experience: ${formData.pastWorkExperience || "FRESHER"}
    5. Current Work Experience: ${formData.currentWorkExperience || "FRESHER"}
    6. Core Skill Set: ${formData.coreSkills}
    7. Name of the Company: ${formData.companyName}
    8. Type of the Company: ${formData.companyType}
    10. Nature of Post: ${formData.postNature}

    Based on above feeded informations take a interview on the following topic (one question only):  
    ${
      formData.postNature === "Junior"
        ? "Ask me a concise question ONLY on Educational qualifications and Aptitude. Do not ask about work experience."
        : "Ask me a concise question on below:\n1. Subject Knowledge"
    }
    For date: ${date} and time: ${time}(dont display it in output)
    `;

    let data = {
      ...formData,
      initialPrompt,
    };

    if (allRequiredFieldsFilled) {
      setWarning(false);
      navigate("/interview", { state: data });
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
    // <SubscriptionCheck
    //   onSubscriptionSuccess={handleSubscriptionSuccess}
    //   onSubscriptionError={handleSubscriptionError}
    // >
      <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              AI Mock Interview
            </h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Practice your interview skills with our AI-powered interview
              simulator
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-12 justify-between">
            {/* Left Column - Image and Benefits */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={img4}
                  alt="Mock Interview"
                  className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
                />
              </div>

              <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                  Why AI Interview?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-[var(--accent-teal)] mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Practice real interview scenarios</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-[var(--accent-teal)] mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Receive instant feedback</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-[var(--accent-teal)] mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Improve your interview skills</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-[var(--accent-teal)] mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Prepare for specific company interviews</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-[var(--accent-teal)] mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Build confidence for your next opportunity</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-2/3">
              <form
                onSubmit={handleSubmit}
                onKeyDown={handleEnterPressed}
                className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                      Personal Information
                    </h3>

                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-lg font-medium text-white"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                        placeholder="FirstName MiddleName LastName"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="educationQualifications"
                        className="block text-lg font-medium text-white"
                      >
                        Educational Qualifications
                      </label>
                      <input
                        type="text"
                        id="educationQualifications"
                        value={formData.educationQualifications}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                        placeholder="e.g., 3rd year CSE"
                      />
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                      Work Experience
                    </h3>

                    <div>
                      <label
                        htmlFor="currentWorkExperience"
                        className="block text-lg font-medium text-white"
                      >
                        Current Work Experience <span className="text-sm text-teal-100/70">(Optional for Freshers)</span>
                      </label>
                      <div className="p-4 bg-[var(--primary-black)]/20 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={currentExperience.companyName}
                            onChange={(e) =>
                              handleCurrentExperienceChange(
                                "companyName",
                                e.target.value
                              )
                            }
                            className="p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Years"
                            min={0}
                            value={currentExperience.years}
                            onChange={(e) =>
                              handleCurrentExperienceChange(
                                "years",
                                e.target.value
                              )
                            }
                            className="p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                          />
                        </div>
                        <div className="mt-3">
                          <textarea
                            placeholder="Job Description"
                            value={currentExperience.description}
                            onChange={(e) =>
                              handleCurrentExperienceChange(
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="pastWorkExperience"
                        className="block text-lg font-medium text-white"
                      >
                        Past Work Experience<span className="text-sm text-teal-100/70">(Optional for Freshers)</span>
                        
                      </label>

                      {workExperiences.map((exp, index) => (
                        <div
                          key={index}
                          className="p-4 bg-[var(--primary-black)]/20 rounded-lg mb-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <input
                              type="text"
                              placeholder="Company Name"
                              value={exp.companyName}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "companyName",
                                  e.target.value
                                )
                              }
                              className="p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                            />
                            <input
                              type="number"
                              placeholder="Years"
                              value={exp.years}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "years",
                                  e.target.value
                                )
                              }
                              className="p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                            />
                          </div>
                          <textarea
                            placeholder="Job Description"
                            value={exp.description}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                            rows="2"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeExperience(index)}
                              className="mt-2 text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove Experience
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addExperience}
                        className="px-4 py-2 bg-[var(--accent-teal)] text-white rounded-lg hover:bg-opacity-90"
                      >
                        Add Another Experience
                      </button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                      Skills & Expertise
                    </h3>

                    <div>
                      <label
                        htmlFor="coreSkills"
                        className="block text-lg font-medium text-white"
                      >
                        Core Skill Sets
                      </label>
                      <input
                        type="text"
                        id="coreSkills"
                        value={formData.coreSkills}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                        placeholder="e.g., React, Node.js, Python"
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                      Company & Position Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="companyName"
                          className="block text-lg font-medium text-white"
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                          placeholder="e.g., Google, Microsoft"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="companyType"
                          className="block text-lg font-medium text-white"
                        >
                          Company Type
                        </label>
                        <select
                          id="companyType"
                          value={formData.companyType}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                        >
                          <option value="">Select Company Type</option>
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                          <option value="MNC">MNC</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="interviewPost"
                          className="block text-lg font-medium text-white"
                        >
                          Interview Position
                        </label>
                        <input
                          type="text"
                          id="interviewPost"
                          value={formData.interviewPost}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="postNature"
                          className="block text-lg font-medium text-white"
                        >
                          Nature of Position
                        </label>
                        <select
                          id="postNature"
                          value={formData.postNature}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg bg-[var(--primary-black)]/20 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:outline-none"
                        >
                          <option value="">Select Post Nature</option>
                          <option value="Junior">Junior</option>
                          <option value="Middle">Middle</option>
                          <option value="Officer">Officer</option>
                          <option value="Executive">Executive</option>
                          <option value="Management">Management</option>
                          <option value="Top Management">Top Management</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-8">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-lg transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center group"
                  >
                    <span className="mr-2">Start Interview</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>

                {/* Warning Message */}
                {warning && (
                  <div
                    className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-3 animate-fadeIn"
                    role="alert"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-white">
                      Please fill all the required fields to continue.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Home Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <HomeButton />
        </div>
      </div>
    // </SubscriptionCheck>
  );
};

export default MockInterview;
