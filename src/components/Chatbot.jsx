import React, { useState, useEffect, useRef } from "react";
import APIService from "./API";
import { PiArrowBendRightUpFill } from "react-icons/pi";
import { BsRobot } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
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
    <div className="flex justify-center items-center min-h-screen bg-[var(--primary-black)] p-4 w-screen">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-[var(--primary-black)] to-[var(--primary-violet)]/30 rounded-2xl shadow-2xl p-6 border border-[var(--accent-teal)]/20">
        {/* Chat Header */}
        <div className="flex items-center justify-between text-white p-4 mb-6 border-b border-[var(--accent-teal)]/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] flex items-center justify-center shadow-lg">
              <BsRobot className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-teal)] to-white">
              AI Assistant
            </h2>
          </div>
          <div className="text-sm text-gray-400">
            {conversationHistory.length > 0 ? 
              `${conversationHistory.length} messages` : 
              "Start a conversation"}
          </div>
        </div>

        {/* Welcome Message */}
        {conversationHistory.length === 0 && (
          <div className="text-center p-6 my-8 rounded-xl bg-[var(--primary-violet)]/10 border border-[var(--accent-teal)]/20">
            <h3 className="text-xl font-semibold text-white mb-3">Welcome to AI Assistant</h3>
            <p className="text-gray-300 mb-4">I'm here to help answer your questions and assist with your tasks.</p>
            <p className="text-[var(--accent-teal)] italic">Try asking me something!</p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="chat-messages mt-4 overflow-y-auto h-[350px] sm:h-[400px] md:h-[450px] p-4 space-y-5 custom-scrollbar">
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`flex items-start max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md ${
                  message.role === "user" 
                    ? "bg-gradient-to-r from-[var(--primary-violet)] to-blue-600 ml-2" 
                    : "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] mr-2"
                }`}>
                  {message.role === "user" ? (
                    <FaUser className="text-white text-xs" />
                  ) : (
                    <BsRobot className="text-white text-xs" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl break-words text-sm sm:text-base ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[var(--primary-violet)] to-blue-600 text-white rounded-tr-none"
                      : "bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-tl-none"
                  } shadow-md transform transition-all duration-200 hover:scale-[1.02]`}
                >
                  <ReactMarkdown className="prose prose-invert max-w-none prose-pre:bg-gray-800 prose-pre:p-2 prose-pre:rounded-md">
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[var(--primary-violet)]/30 text-white p-3 rounded-2xl rounded-tl-none flex items-center">
                <div className="mr-2">
                  <LoadingSpinner className="w-5 h-5" />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex items-center gap-2 relative"
        >
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="w-full p-4 text-base rounded-full bg-[var(--primary-black)] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] border border-[var(--primary-violet)]/50 shadow-inner pl-6 pr-12"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 p-2 rounded-full bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white hover:opacity-90 focus:outline-none transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner className="w-6 h-6" />
            ) : (
              <PiArrowBendRightUpFill className="text-xl" />
            )}
          </button>
        </form>
        
        {/* Features */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <span className="px-2 py-1 rounded-full bg-[var(--primary-violet)]/20 border border-[var(--accent-teal)]/10">
            Powered by Gemini
          </span>
          <span className="px-2 py-1 rounded-full bg-[var(--primary-violet)]/20 border border-[var(--accent-teal)]/10">
            Markdown Support
          </span>
          <span className="px-2 py-1 rounded-full bg-[var(--primary-violet)]/20 border border-[var(--accent-teal)]/10">
            Code Highlighting
          </span>
        </div>
      </div>
      <HomeButton></HomeButton>
    </div>
  );
}

export default Cognito;
