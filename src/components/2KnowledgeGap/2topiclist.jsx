import React, { useEffect, useRef, useState } from "react";
import APIService from "../API"; 
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import img2 from "../../assets/inputimages/img2.jpg";
import { FaPlus, FaTrash, FaRedo, FaCheck, FaArrowRight } from "react-icons/fa";

const TopicsList = () => {
  const [Topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [finalizedTopics, setFinalizedTopics] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [originaltopics, setoriginaltopics] = useState("");
  const [hideInfo, setHideInfo] = useState(false);
  const [startasssessmentbutton, setstartasssessmentbutton] = useState(false);
  const finaltopicsref = useRef("");
  const navigate = useNavigate();
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  // Fetch topics from Gemini API
  const fetchTopicsFromAPI = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!subject) {
      alert("Please enter a subject.");
      setLoading(false);
    } else {
      const question = `You are my mentor, 
      and your goal is to identify my knowledge gaps in a given subject through an interactive session.
      Generate a list of 12 topics for the subject: ${subject}. 
      The topics must cover key-concepts of the subject. 
      The list must be in the json format as below:
    {
    "topics": ["topic-1", "topic-2", "topic-3", "topic-4"]
    }.
    For date: ${date} and time: ${time}(dont display it in output)
    `;
      await APIService({
        question,
        onResponse: (data) => {
          const temp = data.candidates[0].content.parts[0].text;
          const temp2 = temp.slice(7, temp.length - 4); // Assuming you are slicing for some reason

          try {
            const parsedData = JSON.parse(temp2); // Parse the JSON string into an object
            const Topics = parsedData.topics; // Access the 'topics' array
            setoriginaltopics(Topics);
            setLoading(false);
            setHideInfo(true);

            if (Topics.length > 0) {
              setTopics(Topics); // Update the topics in state
              setSelectedTopics(Topics); // Set the selected topics (if needed)
            } else {
              alert("No topics found for the given subject.");
              setLoading(false);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            setLoading(false);
          }
        },
      });
    }
  };

  // Toggle topic selection for deletion
  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Add a new topic
  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics((prev) => {
        const updatedTopics = [...prev, newTopic]; // Add the new topic
        setSelectedTopics(updatedTopics); // Ensure all topics are selected
        return updatedTopics; // Return the updated topics to update state
      });
      setNewTopic(""); // Clear the input field after adding
      setFinalizedTopics("");
    }
  };

  // Delete selected topics
  const deleteTopics = () => {
    setTopics((prev) => prev.filter((topic) => selectedTopics.includes(topic)));
    setSelectedTopics((prev) =>
      prev.filter((topic) => selectedTopics.includes(topic))
    );
  };

  // Finalize topics
  const finalizeTopics = () => {
    setTopics((prev) => prev.filter((topic) => selectedTopics.includes(topic)));
    setSelectedTopics((prev) =>
      prev.filter((topic) => selectedTopics.includes(topic))
    );
    setFinalizedTopics(selectedTopics); // Update finalizedTopics with selectedTopics

    setstartasssessmentbutton(true);
    setTimeout(() =>
      finaltopicsref.current.scrollIntoView({ behavior: "smooth" })
    );
  };
  
  //handle reset topics
  const handleResetTopics = () => {
    if (originaltopics) {
      setTopics(originaltopics);
      setSelectedTopics(originaltopics);
    } else {
      alert("Reset is not working properly.");
    }
  };

  // Start assessment
  const startAssessment = () => {
    navigate("/knowledge-gap/assessment", {
      state: { topics: finalizedTopics },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src={img2}
              alt="Knowledge Gap Assessment"
              className="relative w-3/4 sm:w-1/2 md:w-2/5 lg:w-4/5 h-auto object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
        
        {/* Form and Topics Section */}
        <div className="w-full lg:w-2/3 max-w-2xl flex flex-col gap-6">
          {/* Subject Entry Form */}
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Identify Your Knowledge Gaps
            </h2>
            
            <form onSubmit={fetchTopicsFromAPI} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="SubjectEntry"
                  className="block text-lg font-medium text-white"
                >
                  Enter a subject to assess your knowledge
                </label>
                <input
                  type="text"
                  id="SubjectEntry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
                  placeholder="e.g., Mathematics, Biology, Physics"
                />
              </div>
              
              {loading && (
                <div className="flex justify-center items-center py-4">
                  <LoadingSpinner />
                  <p className="ml-4 text-lg animate-pulse">Generating topics...</p>
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                  disabled={loading}
                >
                  <span>{loading ? "Generating..." : "Generate Topics"}</span>
                  {!loading && <FaArrowRight />}
                </button>
              </div>
            </form>
          </div>

          {/* Topics List Section */}
          {hideInfo && (
            <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-white">
                  Key Topics in {subject}
                </h3>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleResetTopics}
                    className="p-2 rounded-lg bg-[var(--primary-black)] text-white hover:bg-[var(--primary-black)]/80 transition-all flex items-center gap-1"
                    title="Reset to original topics"
                  >
                    <FaRedo className="text-[var(--accent-teal)]" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                  
                  <button
                    onClick={deleteTopics}
                    className="p-2 rounded-lg bg-[var(--primary-black)] text-white hover:bg-[var(--primary-black)]/80 transition-all flex items-center gap-1"
                    title="Delete unselected topics"
                  >
                    <FaTrash className="text-[var(--accent-teal)]" />
                    <span className="hidden sm:inline">Delete Unselected</span>
                  </button>
                </div>
              </div>
              
              {/* Topics List */}
              <div className="bg-[var(--primary-black)]/40 rounded-xl p-4 border border-[var(--accent-teal)]/10 mb-6">
                <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar p-2">
                  {Topics.map((topic, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 hover:border-[var(--accent-teal)]/40 transition-colors"
                    >
                      <label className="flex items-center w-full cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                            className="sr-only peer"
                          />
                          <div className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selectedTopics.includes(topic) 
                              ? 'bg-[var(--accent-teal)] border-[var(--accent-teal)]' 
                              : 'bg-transparent border-gray-400'
                          } transition-colors`}>
                            {selectedTopics.includes(topic) && <FaCheck className="text-white text-xs" />}
                          </div>
                        </div>
                        <span className="ml-3 text-white">{topic}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Add New Topic */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add a new topic"
                    className="flex-1 p-3 rounded-lg bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
                  />
                  <button
                    onClick={addTopic}
                    className="p-3 rounded-lg bg-[var(--primary-black)] text-white hover:bg-[var(--primary-black)]/80 transition-all"
                    disabled={!newTopic.trim()}
                  >
                    <FaPlus className="text-[var(--accent-teal)]" />
                  </button>
                </div>
              </div>
              
              {/* Finalize Button */}
              <div className="flex justify-center">
                <button
                  onClick={finalizeTopics}
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                >
                  <span>Finalize Topics</span>
                  <FaCheck />
                </button>
              </div>
              
              {/* Start Assessment Button */}
              {startasssessmentbutton && (
                <div ref={finaltopicsref} className="mt-8 text-center">
                  <p className="mb-4 text-lg text-[var(--accent-teal)]">
                    Your topics have been finalized. Ready to start the assessment?
                  </p>
                  <button
                    onClick={startAssessment}
                    className="px-8 py-3 bg-[var(--accent-teal)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2 mx-auto"
                  >
                    <span>Start Assessment</span>
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default TopicsList;
