import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Mylogo from "../../assets/MyLogonew.png";
import { useAuth } from "../../context/AuthContext";
import { useSubscriptionToggle } from "../../context/SubscriptionToggleContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { wantSubscription } = useSubscriptionToggle();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--primary-black)]/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Mylogo} alt="Logo" className="h-12 w-auto mr-4" />
          <h1 className="text-2xl font-bold text-white">
            <span className="text-[var(--accent-teal)]">Meri</span>Shiksha
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/aboutUs"
                className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contactUs"
                className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <a
                href="https://youtu.be/GNJ-4Oo9gnY?si=OBUYcBt6zUvq9UiH"
                className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                AI Help
              </a>
            </li>
            <li>
              <Link
                to="/admin/login"
                className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              >
                Admin Portal
              </Link>
            </li>
            
            {currentUser ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
                  >
                    Logout
                  </button>
                </li>
                {currentUser.role === 'admin' && (
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="text-[var(--accent-teal)] hover:text-[var(--accent-teal)]/80 transition-colors"
                    >
                      Admin
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <>
                {wantSubscription && (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                    className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[var(--primary-black)] shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 p-6`}
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="mt-12 space-y-6 text-center">
          <li>
            <Link
              to="/"
              className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/aboutUs"
              className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contactUs"
              className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li>
            <a
              href="https://youtu.be/GNJ-4Oo9gnY?si=OBUYcBt6zUvq9UiH"
              className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              AI Help
            </a>
          </li>
          <li>
            <Link
              to="/admin/login"
              className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Portal
            </Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
                >
                  Logout
                </button>
              </li>
              {currentUser.role === 'admin' && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="text-[var(--accent-teal)] hover:text-[var(--accent-teal)]/80 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}
            </>
          ) : (
            <>
              {wantSubscription && (
                <>``
                  <li>
                    <Link
                      to="/login"
                      className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                  className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors inline-block mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
