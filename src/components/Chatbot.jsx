import React, { useState, useEffect, useRef } from "react";
import APIService from "./API";
import { PiArrowBendRightUpFill } from "react-icons/pi";
import robotImg from "../assets/chatbotImage.jpg";
import LoadingSpinner from "./LoadingSpinner";
import ReactMarkdown from "react-markdown";
import HomeButton from "./HomeButton";

function Cognito() {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const handleInputChange = (event) => setUserInput(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userInput.trim() === "") return;

    setLoading(true);
    const userMessage = { role: "user", content: userInput };
    setConversationHistory((prev) => [...prev, userMessage]);
    setUserInput("");

    try {
      await APIService({
        question: userInput,
        onResponse: (data) => {
          const botResponse = {
            role: "assistant",
            content:
              data?.candidates?.[0]?.content?.parts?.[0]?.text ||
              "Oops! No response received.",
          };
          setConversationHistory((prev) => [...prev, botResponse]);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      setConversationHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again later.",
        },
      ]);
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4 w-screen">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-gray-800 rounded-lg shadow-lg p-2 ">
        {/* Chat Header */}
        <div className="flex items-center justify-between text-white p-2 border-b border-gray-700">
          <img src={robotImg} className="chat-icon h-15 w-15" />{" "}
          <h2 className=" font-semibold text-white !lg:text-5xl ">
            AI Chatbot
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages mt-4 overflow-y-auto h-[350px] sm:h-[400px] p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-[90%] break-words text-sm sm:text-base ${
                message.role === "user"
                  ? "bg-teal-500 text-white ml-auto"
                  : "bg-blue-500 text-white"
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex items-center gap-2 pb-10"
        >
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 p-2 sm:p-3 text-sm rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {loading ? (
            <LoadingSpinner className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : null}
          <button
            type="submit"
            className="p-2 sm:p-3 rounded-lg !bg-teal-500 text-white !hover:bg-teal-600 focus:outline-none"
          >
            <PiArrowBendRightUpFill className="text-lg sm:text-xl" />
          </button>
        </form>
      </div>
      <HomeButton></HomeButton>
    </div>
  );
}

export default Cognito;
