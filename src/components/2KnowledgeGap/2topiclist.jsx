import React, { useEffect, useRef, useState } from "react";
import APIService from "../API"; // Assuming APIService is in the same directory
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import img2 from "../../assets/inputimages/img2.jpg";

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
    console.log("first time clicked");
    console.log(finalizedTopics);
    setTopics((prev) => prev.filter((topic) => selectedTopics.includes(topic)));
    setSelectedTopics((prev) =>
      prev.filter((topic) => selectedTopics.includes(topic))
    );
    setFinalizedTopics(selectedTopics); // Update finalizedTopics with selectedTopics

    setstartasssessmentbutton(true);
    setTimeout(() =>
      finaltopicsref.current.scrollIntoView({ behaviour: "scrolling" })
    );
  };
  //handl reset topics
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
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-secondary to-black text-white py-6 md:py-10 px-4 md:px-6 flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-8 overflow-x-hidden">
      {/* Image Section */}
      <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
        <img
          src={img2}
          alt="Knowledge Gap Assessment"
          className="w-3/4 sm:w-1/2 md:w-2/5 lg:w-4/5 h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
      
      {/* Form and Topics Section */}
      <div className="w-full lg:w-2/3 max-w-2xl flex flex-col gap-6">
        {/* Subject Entry Form */}
        <form className="w-full p-4 md:p-6 mb-5 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-white">
            Are You Ready to Level Up Your Knowledge?
          </h2>
          
          <div className="space-y-4">
            <label
              htmlFor="SubjectEntry"
              className="block text-base md:text-lg font-medium text-white"
            >
              Select your subject and begin the challenge
            </label>
            <input
              type="text"
              id="SubjectEntry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="e.g., Mathematics, Biology, Physics"
            />
            
            {loading && (
              <div className="flex justify-center my-4">
                <LoadingSpinner />
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <button
                onClick={fetchTopicsFromAPI}
                className="px-6 py-2 rounded-lg btn btn-info"
                disabled={loading}
              >
                {loading ? "Fetching..." : "Fetch Topics"}
              </button>
            </div>
          </div>
        </form>

        {/* Topics List Section */}
        {hideInfo && (
          <div className="w-full p-4 md:p-6 mb-5 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
            {/* Topics List */}
            <div className="mb-6">
              <h4 className="text-xl md:text-2xl font-semibold mb-4 text-white text-center">
                Topics
              </h4>
              <ul className="space-y-2 max-h-80 overflow-y-auto p-2">
                {Topics.map((topic, index) => (
                  <li
                    key={index}
                    className="flex w-full items-center bg-neutral-700 p-2 rounded-lg text-white"
                  >
                    <label className="flex items-center w-full cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                        className="form-checkbox mr-3 h-5 w-5 text-accent focus:ring-accent"
                      />
                      <span className="text-white text-sm md:text-base">{topic}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add Topic */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Add new topic"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="flex-grow p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                />
                <button
                  onClick={addTopic}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105"
                >
                  Add Topic
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={finalizeTopics}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Lock Topics
              </button>
              <button
                onClick={handleResetTopics}
                className="px-5 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all transform hover:scale-105"
              >
                Reset Topics
              </button>
            </div>

            {/* Display Finalized Topics */}
            {finalizedTopics.length > 0 && (
              <div className="mb-6" ref={finaltopicsref}>
                <h4 className="text-xl font-semibold mb-4 text-white text-center">
                  Locked Topics
                </h4>
                <ul className="space-y-2 max-h-80 overflow-y-auto p-2">
                  {finalizedTopics.map((topic, index) => (
                    <li
                      key={index}
                      className="bg-secondary p-3 rounded-lg text-white text-sm md:text-base"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Start Assessment Button */}
        {startasssessmentbutton && (
          <div className="flex justify-center mb-6">
            <button
              onClick={startAssessment}
              className="px-6 py-2 rounded-lg btn btn-info hover:scale-105"
            >
              Let's Go!
            </button>
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

export default TopicsList;
