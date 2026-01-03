import axios from "axios";

const APIService = async ({ question, onResponse, retries = 2 }) => {

  const API_KEY = "AIzaSyCx9HnzaZy4yD6cUBMzcYQIY1Wl2vz8t8o";


  const makeRequest = async (attempt = 1) => {
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: "POST",
        data: {
          contents: [{ parts: [{ text: question }] }],        },
        timeout: 120000, // 120 second timeout for complex requests
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200 && response.data) {
        onResponse(response.data);
      } else {
        console.error("Invalid response from backend API:", response);
        onResponse({
          candidates: [{
            content: {
              parts: [{
                text: "Sorry, we couldn't generate a response. Please try again later."
              }]
            }
          }]
        });
      }
    } catch (error) {
      console.error(`Error generating response (attempt ${attempt}):`, error);
      
      // Retry logic for timeout errors
      if (error.code === 'ECONNABORTED' && attempt <= retries) {
        console.log(`Retrying request... (${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        return makeRequest(attempt + 1);
      }
      
      // Provide specific error messages based on error type
      let errorMessage = "An error occurred while processing your request. Please try again later.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "The request timed out. This usually happens with complex requests. Please try again or simplify your request.";
      } else if (error.response && error.response.status === 429) {
        errorMessage = "API rate limit exceeded. Please wait a moment and try again.";
      } else if (error.response && error.response.status === 403) {
        errorMessage = "API key authentication failed. Please check your API configuration.";
      } else if (error.response && error.response.status === 400) {
        errorMessage = "Invalid request format. Please check your input.";
      }
      
      onResponse({
        candidates: [{
          content: {
            parts: [{
              text: errorMessage
            }]
          }
        }]
      });
    }
  };

  await makeRequest();
};

export default APIService;
