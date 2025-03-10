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
    if (e.key === "Enter") {
      handleSubmit(e);
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
          Find Your Dream Job
        </h2>
        <form onSubmit={handleSubmit} onKeyDown={handleEnterPressed}>
          {/* Input Fields */}
          <div className="space-y-4">
            <label
              htmlFor="name"
              className="block text-lg text-white font-medium mb-0"
            >
              Enter Full Name:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., FirstName MiddleName LastName"
            />

            <label
              htmlFor="education"
              className="block text-lg text-white font-medium mb-0"
            >
              Current Education:
            </label>
            <input
              type="text"
              id="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., B.Tech in Computer Science"
            />

            <label
              htmlFor="job"
              className="block text-lg text-white font-medium mb-0"
            >
              Desired Job Profile:
            </label>
            <input
              type="text"
              id="job"
              value={formData.job}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Software Developer"
            />

            <label
              htmlFor="domain"
              className="block text-lg text-white font-medium mb-0"
            >
              Domain Industry:
            </label>
            <input
              type="text"
              id="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Information Technology"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button className="btn btn-info" disabled={loading}>
              Submit
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

export default AIJobHunt;
