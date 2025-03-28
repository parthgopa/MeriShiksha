import React, { useState, useEffect, useRef } from "react";
import APIService from "../API"; // Assuming you have an API service to handle it
import { useLocation, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown"; // Add this import
import LoadingSpinner from "../LoadingSpinner"; // Import the LoadingSpinner component
import HomeButton from "../HomeButton";
import Speech from "react-speech";
import { HiMiniStop } from "react-icons/hi2";
import { PiSpeakerHighFill } from "react-icons/pi";

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
  const date = new Date().toDateString();
  const time = new Date().toTimeString();
  const [highlightedIndex, setHighlightedIndex] = useState(0); // State to track highlighted character index
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  const handleOnResponse = (part, response) => {
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
  };

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

  }, [initialPrompt, currentPart]);

  const handleBack = () => {
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
  };

  const handleNext = async () => {
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
  };

  const handlePrevious = () => {
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
  };

  const handleFinish = () => {
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
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response).then(() => {
      alert("Copied to clipboard successfully.");
    });
  };

  const handleSpeak = () => {
    if (currentSpeechResponse && speechRef.current) {
      if (!isSpeaking) {
        setIsSpeaking(true);
        // The play method is called on the Speech component via ref
        speechRef.current.play();
      }
    }
  };

  const handleStop = () => {
    if (isSpeaking && speechRef.current) {
      setIsSpeaking(false);
      // The pause method is called on the Speech component via ref
      speechRef.current.pause();
    }
  };

  // Custom style for Speech component
  const speechStyle = {
    play: {
      display: 'none', // Hide the default play button
    },
    stop: {
      display: 'none', // Hide the default stop button
    }
  };

  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const input = document.getElementById("output-container");
    html2canvas(input, { scale: 2 }) // Reduce the scale from 5 to 2
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8); // Change to JPEG and lower quality
        const pdfWidth = canvas.width * 0.75; // Convert pixels to points
        const pdfHeight = canvas.height * 0.75; // Convert pixels to points

        // Create the PDF document with custom dimensions
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${topic} Part -${currentPart}.pdf`);
      })
      .catch((err) => {
        console.error("Failed to generate PDF: ", err);
      });
  };

  return (
    <div
      className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex flex-col items-center"
      id="container"
    >
      <div className="w-full max-w-4xl bg-gradient-to-r from-secondary via-60% to-black from-65% p-2 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold text-white mb-4">
            Topic Learning Part - {currentPart}
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <button
              className="btn btn-info px-4 py-2 rounded-lg transition-all hover:scale-105"
              onClick={handleSpeak}
            >
              {isSpeaking ? "Speaking..." : <PiSpeakerHighFill />}
            </button>
            <button
              className="btn btn-info px-4 py-2 rounded-lg transition-all hover:scale-105"
              onClick={handleStop}
            >
              <HiMiniStop />
            </button>
            <label className="flex items-center gap-2">
              Speed:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-32 rounded-lg bg-secondary text-white"
              />
              <span>{speechRate}x</span>
            </label>
            {/* Hidden Speech component controlled via ref */}
            <div style={{ display: 'none' }}>
              <Speech
                ref={speechRef}
                text={currentSpeechResponse}
                pitch={1}
                rate={speechRate}
                volume={1}
                lang="en-US"
                voice="Google US English"
                style={speechStyle}
              />
            </div>
          </div>
        </div>


        {loading ? (
          <LoadingSpinner /> // Render spinner when loading
        ) : (
          <>
            <div
              id="output-container"
              className="p-2 rounded-lg bg-secondary text-white"
            >
              <ReactMarkdown
                className="max-w-auto text-white"
                children={response}
              />
            </div>
            <div
              className="flex flex-wrap justify-center gap-4 mt-6"
              id="buttonGroup"
            >
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handlePrevious}
                disabled={currentPart === 1 || loading}
              >
                Previous
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleNext}
                disabled={currentPart === parts || loading}
              >
                Next
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleFinish}
                disabled={currentPart === parts || loading}
              >
                Finish
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleCopyToClipboard}
              >
                Copy to Clipboard
              </button>
              <button
                className="btn btn-info px-6 py-2 rounded-lg transition-all hover:scale-105"
                onClick={handleDownloadPdf}
              >
                Download Pdf
              </button>
            </div>
          </>
        )}

        <HomeButton className="mt-6 btn btn-accent px-6 py-2 rounded-lg" />
      </div>
    </div>
  );
};

export default LearningTopic;
