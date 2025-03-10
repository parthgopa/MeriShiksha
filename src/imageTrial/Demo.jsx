import React, { useState } from 'react';
import ReactMarkdown from "react-markdown";

export default function GeminiImageAnalyzer() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const apiKey = 'AIzaSyAiUqUOYbZs2blgfFRBiD6XGyBeZKTiQRI';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      if (!base64Data.includes('base64')) {
        setError('Image processing failed');
        return;
      }
      setImage(base64Data.split(',')[1]);
    };
    reader.onerror = () => setError('Failed to read image file');
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please upload an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { 
                  text: "Explain the image in clear bullet points using this format:\n- Category 1: Description\n- Category 2: Description\n- Key Findings: Itemized list" 
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: image
                  }
                }
              ]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error Details:', data);
        throw new Error(`API Error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('No text found in API response');
      }

      setResponse(data.candidates[0].content.parts[0].text);
    } catch (err) {
      setError(err.message);
      console.error('API Request Failed:', {
        error: err,
        imageSize: image?.length
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-10 px-6">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-center mb-8 text-white"
            style={{ fontFamily: "var(--font-heading)" }}>
          Image Analysis with Gemini AI
        </h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-8 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black">
          <label className="block w-full p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-accent transition-colors duration-300">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <span className="text-white text-lg font-medium">
              {fileName || 'Drop or click to upload image'}
            </span>
          </label>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-4 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg text-red-300 border border-red-500 bg-gradient-to-r from-secondary via-20% to-black">
            {error}
          </div>
        )}

        {response && (
          <div className="p-8 rounded-lg shadow-lg bg-gradient-to-r from-secondary via-20% to-black">
            <h2 className="text-xl font-semibold mb-4 text-white">Analysis Result</h2>
            <div id="output-container" className="mt-6">
              <ReactMarkdown
                className="w-full p-3 rounded-lg text-white"
                children={response}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}