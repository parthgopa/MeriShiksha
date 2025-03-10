import React from "react";
import exampleImage from "../assets/homepagema.jpg";
// import FirstPage from "./FirstPage";
import Functionalities from "./Functionalities";

const Home = () => {
  return (
    <div>
      <FirstPage />
      <Functionalities />
      <img
        src={exampleImage}
        alt="Description of image"
        className="App-image"
      />
    </div>
  );
};

export default Home;
