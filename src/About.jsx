import React from "react";
import HomeButton from "./components/HomeButton";

const About = () => {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-secondary to-black p-2">
      {/* About Container */}
      <div className="bg-gray-900 shadow-xl rounded-2xl p-2 max-w-3xl w-full">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-white bg-clip-text bg-gradient-to-r from-accent to-white !m-6">
          About - MeriShiksha.com
        </h2>

        {/* Scrollable Content */}
        <div className="max-h-auto overflow-y-auto p-3 bg-gray-800 rounded-lg shadow-inner">
          <p className="text-gray-300">
            Welcome to{" "}
            <a
              href="http://www.merishiksha.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold hover:underline"
            >
              www.merishiksha.com
            </a>
            , a cutting-edge educational platform powered by Google AI.
            Developed by <span className="font-bold">Parth Gopani</span>, a
            third-year Computer Science Engineering student at{" "}
            <span className="font-bold">
              The Maharaja Sayajirao University of Baroda
            </span>
            , this portal redefines career development and academic excellence
            for students worldwide.
          </p>

          <p className="mt-4 text-gray-300">
            Through its advanced AI-driven tools, MeriShiksha.com empowers users
            to:
          </p>
          <ul className="list-disc list-inside text-gray-400 mt-2">
            <li>Build careers tailored to their skills and aspirations.</li>
            <li>Excel academically with personalized learning resources.</li>
            <li>Achieve their goals through strategic guidance and support.</li>
          </ul>

          {/* Acknowledgments */}
          <h2 className="text-3xl font-bold text-white mt-6">
            Acknowledgments
          </h2>
          <p className="text-gray-300 mt-2">
            This project was brought to life under the expert guidance and
            technical mentorship of{" "}
            <span className="font-bold">Mr. Rajiv Shah</span>, a seasoned AI and
            IT consultant.
          </p>
          <p className="text-gray-300 mt-2">
            We extend our heartfelt gratitude to{" "}
            <span className="font-bold">Upasna Charitable Trust</span> and its
            trustees for their invaluable financial support during the initial
            stages of development.
          </p>
          <p className="text-gray-300 mt-2">
            Finally, we thank all our well-wishers for their unwavering
            encouragement and contributions to this mission.
          </p>
        </div>

        {/* Home Button */}
        <div className="mt-6 flex justify-center">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default About;
