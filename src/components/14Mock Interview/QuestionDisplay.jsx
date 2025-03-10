import React from 'react';
import ReactMarkdown from "react-markdown";
import { PiSpeakerHighFill } from "react-icons/pi";
import { HiMiniStop } from "react-icons/hi2";

const QuestionDisplay = ({
  currentQuestion,
  speaking,
  onToggleSpeech,
  speechRate,
  onSpeechRateChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Question:</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSpeech}
            className="p-2 bg-accent/20 hover:bg-accent/40 rounded-full transition-colors"
            title={speaking ? "Stop Speaking" : "Speak Question"}
          >
            {speaking ? <HiMiniStop size={24} /> : <PiSpeakerHighFill size={24} />}
          </button>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => onSpeechRateChange(parseFloat(e.target.value))}
            className="w-24"
            title="Speech Rate"
          />
        </div>
      </div>

      <div className="p-4 rounded-lg bg-secondary/40">
        <ReactMarkdown className="prose prose-invert">
          {currentQuestion}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default QuestionDisplay;
