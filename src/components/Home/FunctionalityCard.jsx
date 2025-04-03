import React from "react";
import { useNavigate } from "react-router-dom";

const FunctionalityCard = ({ page, index, pageIndex, style }) => {
  const navigate = useNavigate();

  return (
    <div
      key={`functionality-${index}`}
      id={`functionality-${pageIndex}`}
      className="relative bg-gradient-to-br from-[var(--accent-teal)]/80 via-[var(--primary-violet)] to-[var(--primary-black)] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 cursor-pointer text-white border border-transparent hover:border-[var(--accent-teal)]/30"
      onClick={() => navigate(page.path)}
      style={style}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)]"></div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold text-white">{page.title}</h3>
        </div>
        <p className="text-teal-100 mb-4">{page.description}</p>
        <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-md transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center group">
          <span>Explore</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FunctionalityCard;
