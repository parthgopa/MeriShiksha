import React from "react";
import exampleImage from "../assets/homepagema.jpg";

const Home = () => {
  return (
    <div>
      <img
        src={exampleImage}
        alt="Description of image"
        className="App-image"
      />
    </div>
  );
};

export default Home;
