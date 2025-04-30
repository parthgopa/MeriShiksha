import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Mylogo from "../../assets/MyLogonew.png";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from session storage
    const resetEmail = sessionStorage.getItem("resetEmail");
    if (!resetEmail) {
      navigate("/forgot-password");
      return;
    }
    setEmail(resetEmail);

    // Set up countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/verify-reset-code", { email, code });
      
      // Store reset token in session storage
      sessionStorage.setItem("resetToken", response.data.reset_token);
      
      // Navigate to reset password page
      navigate("/reset-password");
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid or expired verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/api/forgot-password", { email });
      setTimeLeft(600); // Reset timer to 10 minutes
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to resend code. Please try again."
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
          <p className="text-gray-400 mt-2">Verify your email</p>
        </div>

        {/* Verification Code Form */}
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="text-center mb-6">
              <p className="text-white">
                We've sent a 6-digit verification code to <span className="text-[var(--accent-teal)]">{email}</span>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                The code will expire in <span className="text-[var(--accent-teal)] font-medium">{formatTime(timeLeft)}</span>
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="code"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength="6"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent transition-all text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6 || timeLeft === 0}
              className={`w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 ${
                (loading || code.length !== 6 || timeLeft === 0) ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading || timeLeft > 540} // Allow resend after 1 minute (60 seconds)
                  className={`text-[var(--accent-teal)] hover:text-[var(--accent-teal)]/80 transition-colors ${
                    loading || timeLeft > 540 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Resend Code
                </button>
              </p>
            </div>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <Link
              to="/forgot-password"
              className="text-[var(--accent-teal)] hover:text-[var(--accent-teal)]/80 transition-colors"
            >
              Use a different email
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

export default VerifyCode;
