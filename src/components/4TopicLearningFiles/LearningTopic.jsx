import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import APIService from "../API"; // Assuming you have an API service to handle it
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown"; // Add this import
import LoadingSpinner from "../LoadingSpinner"; // Import the LoadingSpinner component
import HomeButton from "../HomeButton";
import Speech from "react-speech";
import { HiMiniStop } from "react-icons/hi2";
import { PiSpeakerHighFill } from "react-icons/pi";
import { IoArrowBack, IoArrowForward, IoCheckmarkDone, IoDocumentText } from "react-icons/io5";
import "./LearningTopic.css";

const LearningTopic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, topic, parts, initialPrompt } = location.state;

  const [currentPart, setCurrentPart] = useState(1);
  const [response, setResponse] = useState(initialPrompt);
  const [loading, setLoading] = useState(false); // Add loading state
  const [speechRate, setSpeechRate] = useState(1); // State for speech rate
  const cacheRef = useRef({}); // Cache object to store responses
  const [currentSpeechResponse, setSpeechResponse] = useState("");
  const date = useMemo(() => new Date().toDateString(), []);
  const time = useMemo(() => new Date().toTimeString(), []);
  const [highlightedIndex, setHighlightedIndex] = useState(0); // State to track highlighted character index
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  const handleOnResponse = useCallback((part, response) => {
    // console.log(response)

    const responseText =
      response["candidates"][0]["content"]["parts"][0]["text"];

    // Slicing hashtage from speech text.
    let SpeechResponse = responseText.slice(3, responseText.length);
    setSpeechResponse(SpeechResponse);

    // Add trademark of www.merishiksha.com....
    const FinalResponseText =
      responseText + "\n \t\t\t by www.merishiksha.com\n\n";
    setResponse(FinalResponseText);
    setLoading(false); // Stop spinner once response is received

    // Save response to cache
    cacheRef.current[part] = {
      prompt: part,
      response: responseText,
    };
  }, []);

  useEffect(() => {
    const fetchInitialContent = async () => {
      setLoading(true); // Start spinner when making API call

      // Check cache for the initial part
      if (cacheRef.current[currentPart]) {
        setResponse(cacheRef.current[currentPart].response);
        setLoading(false);
      } else {
        await APIService({
          question: initialPrompt,
          onResponse: (response) => handleOnResponse(currentPart, response),
        });
      }
    };

    fetchInitialContent();

  }, [initialPrompt, currentPart, handleOnResponse]);

  const cancel = useCallback(() => {
    if (speechRef.current && speechRef.current.cancel) {
      speechRef.current.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const handleBack = useCallback(() => {
    cancel();
    // Save form data before navigating back
    if (location.state) {
      localStorage.setItem('topicLearningFormData', JSON.stringify({
        topic: location.state.topic,
        subject: location.state.subject,
        parts: location.state.parts
      }));
    }
    navigate(-1);
  }, [cancel, location.state, navigate]);

  const handleNext = useCallback(async () => {
    if (currentPart < parts) {
      cancel(); // Stop speech immediately when moving to the next part

      const nextPart = currentPart + 1;

      if (cacheRef.current[nextPart]) {
        setResponse(cacheRef.current[nextPart].response);
        setCurrentPart(nextPart);
        setLoading(false);
      } else {
        setLoading(true); // Start spinner when making API call

        let newPrompt = "";
        if (nextPart === 2) {
          newPrompt = `I have completed Part 1 of topic: '${topic}' ${
            subject && `incontext of subject :'${subject}'`
          } and understand its basics. For Part 2, please provide content on the core concepts and fundamental elements of :${topic}.
          Content Type - knowledge-based.
          .Focus on important terms, key components, and foundational ideas to build a solid understanding.When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.For date: ${date} and time: ${time}(dont display it in output)`;
        } else if (nextPart === 3) {
          newPrompt = `Having learned the fundamentals of topic:'${topic}' ${
            subject && `incontext of subject :'${subject}'`
          }, I am ready for Part 3. Provide an overview of the advanced concepts and applications of :${topic}, explaining how it is applied in real-world scenarios and its impact on related fields.
          Content Type - knowledge-based.
          When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.For date: ${date} and time: ${time}(dont display it in output)`;
        } else if (nextPart === 4) {
          newPrompt = `I have completed Parts 1 to 3 of topic:'${topic}' ${
            subject && `incontext of subject :'${subject}'`
          }. For Part 4, provide content on the current trends, contemporary issues, and recent developments in :${topic}. Include challenges, innovations, and the evolving role of ${subject} in society.
          Content Type - knowledge-based.
          When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.For date: ${date} and time: ${time}(dont display it in output)`;
        } else if (nextPart === 5) {
          newPrompt = `With Parts 1 to 4 of topic:'${topic}' ${
            subject && `incontext of subject :'${subject}'`
          } complete, please provide content for Part 5 that explores the future prospects of :${topic}, potential career paths, and upcoming advancements. Highlight opportunities for further learning and professional growth in this field.
          Content Type - knowledge-based.
          When the topic pertains to any law of India, please provide specific references to the relevant sections, rules, and regulations of the particular act, along with any applicable case laws or judicial precedents.For date: ${date} and time: ${time}(dont display it in output)
          `;
        }

        // console.log(newPrompt);

        await APIService({
          question: newPrompt,
          onResponse: (response) => handleOnResponse(nextPart, response),
        });

        setCurrentPart(nextPart);
      }
    }
  }, [cancel, currentPart, parts, subject, topic, handleOnResponse, date, time]);

  const handlePrevious = useCallback(() => {
    if (currentPart > 1) {
      cancel(); // Stop speech immediately when moving to the previous part

      const prevPart = currentPart - 1;

      if (cacheRef.current[prevPart]) {
        setResponse(cacheRef.current[prevPart].response);
        setCurrentPart(prevPart);
        setLoading(false);
      } else {
        setLoading(true); // Start spinner when making API call

        // const prevPrompt = `I am a beginner and I want to learn ${topic} and in ${parts} parts. I had learned part ${currentPart} of the topic, now go to previous part of it.`;

        // APIService({
        //   question: prevPrompt,
        //   onResponse: (response) => handleOnResponse(prevPart, response),
        // });
        setCurrentPart(prevPart);
      }
    }
  }, [cancel, currentPart]);

  const handleFinish = useCallback(() => {
    cancel(); // Stop speech when finishing
    // Save form data before finishing
    if (location.state) {
      localStorage.setItem('topicLearningFormData', JSON.stringify({
        topic: location.state.topic,
        subject: location.state.subject,
        parts: location.state.parts
      }));
    }
    const level = "intermediate";
    const data = { topic: topic, level: level };
    navigate("/finished-learning", { state: data });
  }, [cancel, location.state, navigate, topic, subject]);

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(response).then(() => {
      alert("Copied to clipboard successfully.");
    });
  }, [response]);

  const handleSpeak = useCallback(() => {
    if (currentSpeechResponse && speechRef.current) {
      if (!isSpeaking) {
        setIsSpeaking(true);
        // The play method is called on the Speech component via ref
        speechRef.current.play();
      }
    }
  }, [currentSpeechResponse, isSpeaking]);

  const handleStop = useCallback(() => {
    if (isSpeaking && speechRef.current) {
      setIsSpeaking(false);
      // The pause method is called on the Speech component via ref
      speechRef.current.pause();
    }
  }, [isSpeaking]);

  // Custom style for Speech component
  const speechStyle = {
    play: {
      display: 'none', // Hide the default play button
    },
    stop: {
      display: 'none', // Hide the default stop button
    },
    pause: {
      display: 'none', // Hide the default pause button
    },
  };

  return (
    <div className="learning-topic-container w-screen">
      <div className="learning-topic-content">
        {/* Header */}
        <div className="learning-topic-header">
          <div className="learning-topic-title">
            {topic}
          </div>
          <div className="learning-topic-subtitle">
            Part {currentPart} of {parts}
          </div>
          
          <div className="learning-topic-progress">
            <div className="learning-topic-progress-text">
              Progress: {Math.round((currentPart / parts) * 100)}%
            </div>
          </div>
          
          
        </div>
        
        {/* Content */}
        <div className="learning-topic-content-card">
          {loading ? (
            <div className="learning-topic-loading">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="learning-topic-content-area">
              <div className="learning-topic-markdown">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="learning-topic-controls">
            {/* Speech Controls */}
            <div className="learning-topic-speech-controls">
              <div className="learning-topic-speech-title">
                Audio Controls
              </div>
              <div className="learning-topic-speech-buttons">
                <button
                  onClick={handleSpeak}
                  disabled={loading || isSpeaking}
                  className={`learning-topic-speech-btn play ${
                    isSpeaking ? "disabled" : ""
                  }`}
                >
                  <PiSpeakerHighFill size={20} />
                  <span>Listen</span>
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isSpeaking}
                  className={`learning-topic-speech-btn stop ${
                    !isSpeaking ? "disabled" : ""
                  }`}
                >
                  <HiMiniStop size={20} />
                  <span>Stop</span>
                </button>
              </div>
              <div className="learning-topic-speed-control">
                <label className="learning-topic-speed-label">
                  Speed: {speechRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="learning-topic-speed-slider"
                />
              </div>
            </div>
        
            {/* Navigation */}
            <div className="learning-topic-navigation">
              <div className="learning-topic-nav-row">
                <button 
                  onClick={handleBack}
                  className="learning-topic-nav-btn back"
                >
                  <IoArrowBack size={20} />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="learning-topic-nav-btn back"
                >
                  <IoDocumentText size={20} />
                  <span>Copy</span>
                </button>
              </div>
              
              <div className="learning-topic-nav-row">
                <button
                  onClick={handlePrevious}
                  disabled={currentPart === 1}
                  className={`learning-topic-nav-btn back ${
                    currentPart === 1 ? "disabled" : ""
                  }`}
                >
                  <IoArrowBack size={20} />
                  <span>Previous</span>
                </button>
                
                {currentPart < parts ? (
                  <button
                    onClick={handleNext}
                    className="learning-topic-nav-btn next"
                  >
                    <span>Next</span>
                    <IoArrowForward size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="learning-topic-nav-btn finish"
                  >
                    <span>Finish</span>
                    <IoCheckmarkDone size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden Speech component */}
      <div className="hidden">
        <Speech
          ref={speechRef}
          text={currentSpeechResponse}
          rate={speechRate}
          pitch={1}
          volume={1}
          lang="en-US"
          voice="Google UK English Female"
          onEnd={() => setIsSpeaking(false)}
          style={speechStyle}
        />
      </div>
      
      {/* Home Button */}
      <div className="learning-topic-home-btn">
        <HomeButton />
      </div>
    </div>
  );
};

export default LearningTopic;
