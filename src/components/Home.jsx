import React from "react";
import exampleImage from "../assets/bot1.jpg";
// import FirstPage from "./FirstPage";
import Functionalities from "./Functionalities";
import Footer from "./Home/Footer";

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
      <Footer />
    </div>
  );
};

export default Home;
