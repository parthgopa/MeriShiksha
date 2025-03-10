import React, { useState, useEffect } from "react";
import img4 from "../../assets/inputimages/mockinterview.jpg";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";

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
    postNature: ""
  });
  const [workExperiences, setWorkExperiences] = useState([
    { companyName: '', years: '', description: '' }
  ]);
  const [currentExperience, setCurrentExperience] = useState({
    companyName: '',
    years: '',
    description: ''
  });
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('mockInterviewFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
      
      // Extract current experience if it exists in saved data
      const savedFormData = JSON.parse(savedData);
      if (savedFormData.currentWorkExperience) {
        const match = savedFormData.currentWorkExperience.match(/(\d+) years at (.+)/);
        if (match) {
          setCurrentExperience({
            years: match[1] || '',
            companyName: match[2] || ''
          });
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [id]: value };
      localStorage.setItem('mockInterviewFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleCurrentExperienceChange = (field, value) => {
    setCurrentExperience(prev => {
      const newExp = { ...prev, [field]: value };
      
      // Update the currentWorkExperience in formData
      const formattedExperience = newExp.companyName || newExp.years || newExp.description
        ? `Working with ${newExp.companyName || "N/A"} for ${newExp.years || "0"} years, job description: ${newExp.description || "N/A"}`
        : "";
      
      setFormData(prev => {
        const newData = { ...prev, currentWorkExperience: formattedExperience };
        localStorage.setItem('mockInterviewFormData', JSON.stringify(newData));
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
      .filter(exp => exp.companyName || exp.years || exp.description)
      .map(exp => `${exp.years} years at ${exp.companyName} , job description : ${exp.description}`)
      .join('; ');
    
    setFormData(prev => ({
      ...prev,
      pastWorkExperience: formattedExperience || "FRESHER"
    }));
  };

  const addExperience = () => {
    setWorkExperiences([...workExperiences, { companyName: '', years: '', description: '' }]);
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
    if (!dataToValidate.currentWorkExperience && !dataToValidate.pastWorkExperience) {
      dataToValidate.currentWorkExperience = "FRESHER";
      dataToValidate.pastWorkExperience = "FRESHER";
      
      // Update the actual formData
      setFormData(prev => ({
        ...prev,
        currentWorkExperience: "FRESHER",
        pastWorkExperience: "FRESHER"
      }));
    }

    // Check if required fields are filled
    const requiredFields = ['fullName', 'educationQualifications', 'coreSkills', 'companyName', 'companyType', 'interviewPost', 'postNature'];
    const allRequiredFieldsFilled = requiredFields.every(field => dataToValidate[field]?.trim());

    let initialPrompt = `
    You are my interviewer.
    You will create a simulation of my interview for the post of ${formData.interviewPost}.
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
    ${formData.postNature === "Junior" ? 
      "Ask me a concise question ONLY on Educational qualifications and Aptitude. Do not ask about work experience." :
      "Ask me a concise question on below:\n1. Subject Knowledge"
    }
    For date: ${date} and time: ${time}(dont display it in output)
    `;

    let data = {
      ...formData,
      initialPrompt
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

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-4 md:px-8 lg:px-12">
      {/* Scroll to top effect */}
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Welcome to AI Interview
          </h2>
          <h5 className="text-xl md:text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Fill the details correctly
          </h5>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          {/* Left Column - Image */}
          <div className="lg:w-1/3 flex flex-col items-center">
            <img
              src={img4}
              alt="Mock Interview"
              className="w-full max-w-md rounded-lg shadow-lg object-cover"
            />
            <div className="mt-6 bg-gradient-to-r from-secondary to-black p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl text-white font-semibold mb-3">Why AI Interview?</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Practice real interview scenarios</li>
                <li>Receive instant feedback</li>
                <li>Improve your interview skills</li>
                <li>Prepare for specific company interviews</li>
                <li>Build confidence for your next opportunity</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-2/3">
            <form
              onSubmit={handleSubmit}
              onKeyDown={handleEnterPressed}
              className="bg-gradient-to-r from-secondary via-20% to-black p-6 rounded-lg shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xl font-semibold border-b border-accent pb-2 text-white">Personal Information</h3>
                  
                  <div>
                    <label htmlFor="fullName" className="block text-lg font-medium text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                      placeholder="FirstName MiddleName LastName"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="educationQualifications" className=" block text-lg font-medium text-white">
                      Educational Qualifications
                    </label>
                    <input
                      type="text"
                      id="educationQualifications"
                      value={formData.educationQualifications}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                      placeholder="e.g., 3rd year CSE"
                    />
                  </div>
                </div>

                {/* Work Experience */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xl font-semibold border-b border-accent pb-2 text-white">Work Experience</h3>
                  
                  <div>
                    <label htmlFor="currentWorkExperience" className="block text-lg font-medium text-white">
                      Current Work Experience
                    </label>
                    <div className="p-4 bg-opacity-30 bg-gray-700 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={currentExperience.companyName}
                          onChange={(e) => handleCurrentExperienceChange('companyName', e.target.value)}
                          className="p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Years"
                          min={0}
                          value={currentExperience.years}
                          onChange={(e) => handleCurrentExperienceChange('years', e.target.value)}
                          className="p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                      </div>
                      <div className="mt-3">
                        <textarea
                          placeholder="Job Description"
                          value={currentExperience.description}
                          onChange={(e) => handleCurrentExperienceChange('description', e.target.value)}
                          className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="pastWorkExperience" className="block text-lg font-medium text-white">
                      Past Work Experience <span className="text-sm font-normal text-red-400">(Optional - Leave empty if you are a fresher)</span>
                    </label>
                    
                    {workExperiences.map((exp, index) => (
                      <div key={index} className="p-4 bg-opacity-30 bg-gray-700 rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={exp.companyName}
                            onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                            className="p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Years"
                            value={exp.years}
                            onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
                            className="p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                          />
                        </div>
                        <textarea
                          placeholder="Job Description"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
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
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90"
                    >
                      Add Another Experience
                    </button>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xl font-semibold border-b border-accent pb-2 text-white">Skills & Expertise</h3>
                  
                  <div>
                    <label htmlFor="coreSkills" className="block text-lg font-medium text-white">
                      Core Skill Sets
                    </label>
                    <input
                      type="text"
                      id="coreSkills"
                      value={formData.coreSkills}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xl font-semibold border-b border-accent pb-2 text-white">Company & Position Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companyName" className="block text-lg font-medium text-white">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                        placeholder="e.g., Google, Microsoft"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="companyType" className="block text-lg font-medium text-white">
                        Company Type
                      </label>
                      <select
                        id="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-secondary text-white focus:ring-2 focus:ring-accent focus:outline-none"
                      >
                        <option value="">Select Company Type</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="MNC">MNC</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="interviewPost" className="block text-lg font-medium text-white">
                        Interview Position
                      </label>
                      <input
                        type="text"
                        id="interviewPost"
                        value={formData.interviewPost}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postNature" className="block text-lg font-medium text-white">
                        Nature of Position
                      </label>
                      <select
                        id="postNature"
                        value={formData.postNature}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-secondary text-white focus:ring-2 focus:ring-accent focus:outline-none"
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
                  className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  Start Interview
                </button>
              </div>

              {/* Warning Message */}
              {warning && (
                <div
                  className="mt-6 p-4 bg-teal-600 text-black border border-red-800 rounded-lg text-center text-xl"
                  role="alert"
                >
                  Please fill all the fields!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <HomeButton />
    </div>
  );
};

export default MockInterview;
