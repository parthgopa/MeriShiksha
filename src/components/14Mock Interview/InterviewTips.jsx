import React from 'react';

const InterviewTips = ({ tips, showTips, onToggleTips }) => {
  if (!showTips) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/80 p-4 rounded-lg max-w-md shadow-xl">
      <h4 className="text-lg font-semibold mb-3 text-white">Interview Tips:</h4>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="text-gray-200 text-sm">{tip}</li>
        ))}
      </ul>
      <button
        onClick={onToggleTips}
        className="mt-4 text-sm text-gray-400 hover:text-white"
      >
        Hide Tips
      </button>
    </div>
  );
};

export default InterviewTips;
