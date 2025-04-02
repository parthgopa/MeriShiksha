import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mylogo from "../../assets/MyLogonew.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--primary-black)]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
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
            <li><Link to="/" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors">Home</Link></li>
            <li><a href="#services" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors">Services</a></li>
            <li><Link to="/aboutUs" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors">About</Link></li>
            <li><Link to="/contactUs" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors">Contact</Link></li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[var(--primary-black)] shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 p-6`}> 
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setIsMenuOpen(false)}>
          ✕
        </button>
        <ul className="mt-12 space-y-6 text-center">
          <li><Link to="/" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><a href="#services" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors" onClick={() => setIsMenuOpen(false)}>Services</a></li>
          <li><Link to="/aboutUs" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link to="/contactUs" className="text-gray-300 hover:text-[var(--accent-teal)] transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;