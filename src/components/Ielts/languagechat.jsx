import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import { PiArrowBendRightUpFill } from "react-icons/pi";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { FaRobot, FaUser } from "react-icons/fa";
import HomeButton from "../HomeButton";
import LoadingSpinner from "../LoadingSpinner";
import ReactMarkdown from "react-markdown";

const LanguageChat = () => {
  const location = useLocation(null);
  const navigate = useNavigate();
  const { language, initialMessage } = location.state || {};
  const [messages, setMessages] = useState([
    { text: initialMessage, sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuitPopup, setShowQuitPopup] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    APIService({
      question: `Respond as if you are a native ${language} speaker having a conversation. If I write in English, respond in both ${language} and English. If I write in ${language}, respond in ${language} with an English translation. Keep responses conversational and helpful for language learning. My message: ${input}`,
      onResponse: (data) => {
        const response = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
        setLoading(false);
      },
    });
  };

  const handleQuit = () => {
    setShowQuitPopup(true);
  };

  const confirmQuit = () => {
    navigate("/");
  };

  const handleBackToLearning = () => {
    navigate("/topic-learning");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-3xl mx-auto relative z-10 h-[calc(100vh-3rem)] flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 rounded-t-xl p-4 border-b border-[var(--accent-teal)]/20 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleBackToLearning}
              className="mr-3 text-[var(--accent-teal)] hover:text-white transition-colors"
            >
              <IoArrowBack size={20} />
            </button>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              {language} Chat
            </h2>
          </div>
          <button
            onClick={handleQuit}
            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center text-sm font-medium"
          >
            <IoClose className="mr-1" />
            Quit
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--accent-teal)]/20 scrollbar-track-[var(--primary-black)]/40 bg-[var(--primary-black)]/40 backdrop-blur-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
            >
              <div className={`flex max-w-[85%] ${msg.sender === "bot" ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex-shrink-0 flex items-start pt-1 ${msg.sender === "bot" ? "mr-2" : "ml-2"}`}>
                  {msg.sender === "bot" ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-teal)] to-[var(--primary-violet)] flex items-center justify-center">
                      <FaRobot className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-violet)] to-[var(--accent-teal)] flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                  )}
                </div>
                <div
                  className={`p-3 rounded-xl break-words ${
                    msg.sender === "bot"
                      ? "bg-gradient-to-r from-[var(--primary-violet)]/50 to-[var(--primary-violet)]/30 border border-[var(--primary-violet)]/30"
                      : "bg-gradient-to-r from-[var(--accent-teal)]/50 to-[var(--accent-teal)]/30 border border-[var(--accent-teal)]/30"
                  }`}
                >
                  <ReactMarkdown className="prose prose-invert max-w-none text-sm md:text-base">
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Form */}
        <div className="p-4 bg-gradient-to-r from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 rounded-b-xl border-t border-[var(--accent-teal)]/20 backdrop-blur-sm">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Type in English or ${language}...`}
              className="flex-1 p-3 rounded-lg bg-[var(--primary-black)]/60 text-white placeholder-gray-400 border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent transition-all"
            />
            {loading ? (
              <div className="w-12 h-12 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <button
                type="submit"
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center"
                disabled={loading}
              >
                <PiArrowBendRightUpFill className="text-xl" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Quit Confirmation Popup */}
      {showQuitPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[var(--primary-black)] to-[var(--primary-violet)]/30 p-6 rounded-xl border border-[var(--accent-teal)]/20 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)]">
              Quit Conversation?
            </h3>
            <p className="text-center mb-6 text-gray-300">
              Are you sure you want to end this conversation? Your chat history will not be saved.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowQuitPopup(false)}
                className="px-5 py-2 bg-[var(--primary-black)]/60 text-white rounded-lg border border-[var(--accent-teal)]/20 hover:bg-[var(--primary-black)]/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuit}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default LanguageChat;
