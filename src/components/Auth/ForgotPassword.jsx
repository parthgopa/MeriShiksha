import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Mylogo from "../../assets/MyLogonew.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/api/user/forgot-password", { email });
      setMessage(response.data.message);
      setIsSubmitted(true);
      // Store email in session storage for the verification page
      sessionStorage.setItem("resetEmail", email);
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[var(--primary-black)] p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <img src={Mylogo} alt="MeriShiksha Logo" className="h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">
            <span className="text-[var(--accent-teal)]">Meri</span>Shiksha
          </h1>
          <p className="text-gray-400 mt-2">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send a verification code to this email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-white mb-6">
                A verification code has been sent to your email. Please check your inbox.
              </p>
              <Link
                to="/verify-code"
                className="w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 inline-block"
              >
                Enter Verification Code
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-gray-400 text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-[var(--accent-teal)] hover:text-[var(--accent-teal)]/80 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-[var(--accent-teal)] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[var(--primary-black)] overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--primary-violet)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--accent-teal)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;
