import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import { PiArrowBendRightUpFill } from "react-icons/pi";
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

  const handleSendMessage = (e) => {
    e.preventDefault(0);
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    APIService({
      question: input,
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4 w-screen">
      <div className="relative w-full max-w-md lg:w-full  sm:max-w-lg bg-gray-800 rounded-lg shadow-lg p-2">
        {/* Chat Header */}
        <div className="flex items-center justify-between text-white p-2 border-b border-gray-700">
          <h2 className="font-semibold !text-2xl text-white">
            {language} Chat
          </h2>
          <button
            onClick={handleQuit}
            className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
          >
            Quit
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages mt-4 overflow-y-auto h-[350px] sm:h-[400px] p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[90%] break-words text-sm sm:text-base ${
                msg.sender === "bot"
                  ? "bg-blue-500 text-white"
                  : "bg-teal-500 text-white ml-auto"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <form
          onSubmit={handleSendMessage}
          className="mt-4 flex items-center gap-2 pb-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 p-2 sm:p-3 text-sm rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {loading ? (
            <LoadingSpinner className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : null}
          <button
            type="submit"
            className="p-2 sm:p-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 focus:outline-none"
            disabled={loading}
          >
            <PiArrowBendRightUpFill className="text-lg sm:text-xl" />
          </button>
        </form>
      </div>

      {/* Quit Confirmation Popup */}
      {showQuitPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-emerald-100 p-4 rounded-md text-center">
            <p>Are you sure you want to quit?</p>
            <div className="mt-3 flex justify-center gap-4">
              <button
                onClick={confirmQuit}
                className="btn btn-dark px-4 py-2 text-white rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => setShowQuitPopup(false)}
                className="btn btn-success px-4 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <HomeButton />
    </div>
  );
};

export default LanguageChat;
