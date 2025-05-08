import React, { useState } from "react";
import image from "../assets/main.jpg";
import HomeButton from "./HomeButton";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaRegCommentDots,
} from "react-icons/fa";
import Header from "./Home/Header";
import Footer from "./Home/Footer";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/contact-support",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFeedbackType("success");
        setFeedback(data.message || "Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setFeedbackType("error");
        setFeedback(
          data.error || "Failed to send message. Please try again later."
        );
      }
    } catch (err) {
      setFeedbackType("error");
      setFeedback("Network error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <>
    <Header/>
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--primary-black)] via-[var(--secondary-black)] to-black p-4">
      <div className="bg-gray-900/90 backdrop-blur-md mt-5 shadow-2xl rounded-3xl p-8 md:p-12 max-w-5xl w-full border border-gray-800">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
          Let's Connect – We're Here to Help!
        </h2>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info Card */}
          <div className="flex flex-col justify-center gap-8">
            <img
              src={image}
              alt="Contact Us"
              className="rounded-xl shadow-xl w-64 md:w-80 border-4 border-[var(--accent-teal)]/30 mx-auto"
            />
            <div className="bg-gray-800 rounded-2xl shadow-lg p-7 flex flex-col items-center text-center">
              <FaEnvelope className="text-[var(--primary-violet)] text-3xl mb-2" />
              <h3 className="text-xl font-bold text-white mb-1">
                Email Support
              </h3>
              <p className="text-gray-400 mb-2">
                Prefer writing? Drop us an email.
              </p>
              <span className="text-lg text-white font-semibold">
                📧 info@merishiksha.com
              </span>
            </div>
          </div>
          {/* Contact Form Card */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-7 flex flex-col justify-center">
            <form className="flex flex-col gap-5" onSubmit={sendMessage}>
              <div className="flex items-center bg-gray-900 rounded-lg px-4 py-3 border border-gray-700 focus-within:border-[var(--accent-teal)]">
                <FaUser className="text-[var(--accent-teal)] mr-3 text-lg" />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-gray-900 rounded-lg px-4 py-3 border border-gray-700 focus-within:border-[var(--accent-teal)]">
                <FaEnvelope className="text-[var(--primary-violet)] mr-3 text-lg" />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-start bg-gray-900 rounded-lg px-4 py-3 border border-gray-700 focus-within:border-[var(--accent-teal)]">
                <FaRegCommentDots className="text-[var(--accent-teal)] mr-3 text-lg mt-1" />
                <textarea
                  placeholder="Your Message"
                  className="bg-transparent outline-none text-white w-full placeholder-gray-400 resize-none min-h-[96px]"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity mt-2"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {feedback && (
                <div
                  className={`text-center mt-2 font-medium ${
                    feedbackType === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {feedback}
                </div>
              )}
            </form>
          </div>
        </div>
        {/* Optional: Home Button */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
          <div className="mt-6 md:mt-0">
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
