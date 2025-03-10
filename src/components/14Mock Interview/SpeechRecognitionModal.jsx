import React, { useState, useRef } from 'react';
import { PiMicrophoneDuotone } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import LoadingSpinner from "../LoadingSpinner";

const SpeechRecognitionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialText = '' 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);
  const [previewText, setPreviewText] = useState(initialText);
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(initialText);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = !isMobile;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = transcriptRef.current || '';
    let interimTranscript = '';
    let lastProcessedIndex = 0;

    recognition.onstart = () => {
      setIsRecording(true);
      if (!transcriptRef.current) {
        setPreviewText('');
        finalTranscript = '';
        interimTranscript = '';
        lastProcessedIndex = 0;
      }
    };

    recognition.onresult = (event) => {
      interimTranscript = '';
      
      for (let i = lastProcessedIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          if (isMobile) {
            finalTranscript += (finalTranscript ? ' ' : '') + transcript;
          } else {
            if (!finalTranscript.includes(transcript)) {
              finalTranscript += (finalTranscript ? ' ' : '') + transcript;
            }
          }
        } else {
          interimTranscript = transcript;
        }
      }
      
      lastProcessedIndex = event.results.length;
      finalTranscript = finalTranscript.replace(/\s+/g, ' ').trim();
      
      const displayText = (finalTranscript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
      setPreviewText(displayText);
      transcriptRef.current = finalTranscript;
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return;
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setIsProcessingSpeech(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcriptRef.current) {
        setIsProcessingSpeech(true);
        setIsProcessingSpeech(false);
      }

      if (isMobile && isRecording) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopSpeechRecognition();
    }
    onClose();
  };

  const handleFinalSubmit = () => {
    onSubmit(previewText.trim());
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Speech Input</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose size={24} className="text-gray-600" />
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <button
              onClick={() => {
                if (!isRecording) {
                  startSpeechRecognition();
                } else {
                  stopSpeechRecognition();
                }
              }}
              disabled={isProcessingSpeech}
              className={`p-6 rounded-full ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            >
              <PiMicrophoneDuotone size={40} className={isRecording ? 'animate-bounce' : ''} />
            </button>
            {isRecording && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            )}
          </div>
          <p className="text-lg font-medium text-gray-600">
            {isProcessingSpeech 
              ? 'Processing speech...' 
              : isRecording 
                ? 'Recording... Click to stop' 
                : 'Click to start recording'}
          </p>
          {isProcessingSpeech && (
            <div className="mt-2">
              <LoadingSpinner />
            </div>
          )}
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="p-4 bg-gray-50 text-gray-800 rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-200 shadow-inner">
            {previewText || 'Your speech will appear here...'}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleFinalSubmit}
              disabled={!previewText.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors shadow-md transform hover:scale-105"
            >
              Final Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognitionModal;
