import "./App.css";
import { Outlet } from "react-router";
import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [currentSidebar, setSidebar] = useState("Home");

  return (
    <>
      <div className="Outer-container">
        <div className="sidebar">
          <Navbar currentSidebar={currentSidebar} setSidebar={setSidebar} />
        </div>
        <div className="right-outlet">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
