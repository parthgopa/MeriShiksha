import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import img4 from "../../assets/inputimages/jobhunt.jpg";
import LoadingSpinner from "../LoadingSpinner";

const AIJobHunt = () => {
  const [formData, setFormData] = useState({
    name: "",
    education: "",
    job: "",
    domain: ""
  });
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);

  const navigate = useNavigate();

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('jobHuntFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [id]: value };
      localStorage.setItem('jobHuntFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.education.trim() || !formData.job.trim() || !formData.domain.trim())
      return setWarning(true);

    setLoading(true);

    let initialPrompt = `Name of the student - ${formData.name}
Is basic education - ${formData.education}
Job profile liked - ${formData.job}
Domain - ${formData.domain}

I do not know which companies of my interested domain where I can apply for ${formData.job}
I want your help to find out 20 companies of my interested domain where I can apply as ${formData.job}. 
The list should include MNCs and MSMS of different sizes.

Please provide me the following details of Indian companies in valid JSON object in the following format(only json object no need of disclaimers):
{
  "companies": [
    {
      "name": "company_name_1",
      "address": "address_1",
      "link": "application_link_1"
    },
    {
      "name": "company_name_2",
      "address": "address_2",
      "link": "application_link_2"
    },
    // Add the rest of the companies here
  ]
}.
`;

    let data = {
      initialPrompt: initialPrompt,
      formData: formData // Include form data in navigation state
    };
    
    setWarning(false);
    navigate("/hunted-page", { state: data });
  };

  const handleEnterPressed = (e) => {
    if (e.key === "Enter" && e.target.tagName.toLowerCase() !== 'textarea') {
      e.preventDefault();
      handleSubmit(e);
    }
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
            AI Job Hunt
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Discover the perfect companies for your career aspirations with AI-powered job matching
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={img4}
                alt="Job Hunt"
                className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
                Find Your Dream Job
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Fields with improved styling */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-lg font-medium text-white"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                        placeholder="e.g., John Smith"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="education"
                      className="block text-lg font-medium text-white"
                    >
                      Current Education
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                        placeholder="e.g., B.Tech in Computer Science"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="job"
                      className="block text-lg font-medium text-white"
                    >
                      Desired Job Profile
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="job"
                        value={formData.job}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                        placeholder="e.g., Software Developer"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="domain"
                      className="block text-lg font-medium text-white"
                    >
                      Domain Industry
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                        placeholder="e.g., Information Technology"
                        onKeyDown={handleEnterPressed}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                {warning && (
                  <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-3 animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-white">Please fill all the fields to continue.</span>
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
                        <span className="mr-2">Find Matching Companies</span>
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

export default AIJobHunt;
