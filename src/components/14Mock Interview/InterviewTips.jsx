import React from 'react';
import { IoClose, IoInformationCircle } from "react-icons/io5";

const InterviewTips = ({ tips, showTips, onToggleTips }) => {
  if (!showTips) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[var(--primary-black)] to-[var(--primary-violet)]/30 p-6 rounded-xl border border-[var(--accent-teal)]/20 shadow-2xl max-w-md w-full mx-4 overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-teal)] flex items-center">
            <IoInformationCircle className="mr-2 text-[var(--accent-teal)]" />
            Interview Tips
          </h3>
          <button
            onClick={onToggleTips}
            className="p-2 hover:bg-[var(--primary-black)]/60 rounded-full transition-colors"
          >
            <IoClose size={24} className="text-[var(--accent-teal)]" />
          </button>
        </div>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/10 text-white"
            >
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewTips;
