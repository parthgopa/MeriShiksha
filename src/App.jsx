import "./App.css";
import { Outlet } from "react-router";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Danger from "./components/Danger";
import "index.css";

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
      <hr />
      <Danger />
    </>
  );
}

export default App;
