import axios from "axios";

const APIService = async ({ text,image, onResponse }) => {
  const API_KEY = "AIzaSyAiUqUOYbZs2blgfFRBiD6XGyBeZKTiQRI";

  try {
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      method: "POST",
      data: {
        contents: [{ parts: [
            { 
              text: text
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: image
              }
            }
          ] }],
      },
    });

    onResponse(response.data); // Invoke the callback with the response data
  } catch (error) {
    console.error("Error generating response:", error);
    // onResponse("Please try again. ");
  }
};

export default APIService;
