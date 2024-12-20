import "./App.css";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router";
import { useState } from "react";
import CompanyName from "./components/CompanyName";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [currentSidebar, setSidebar] = useState("Home");

  const handleResponse = (response) => {
    console.log("Response received from server");
    // console.log("API Response:", response['candidates']['0']['content']['parts']['0']['text']);
  };

  return (
    <>
      <CompanyName />
      <div className="container">
        <Sidebar
          currentSidebar={currentSidebar}
          setSidebar={setSidebar}
        ></Sidebar>
        <div className="right-container">
          <Outlet />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default App;
