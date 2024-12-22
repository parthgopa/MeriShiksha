import "./App.css";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Danger from "./components/Danger";

function App() {
  return (
    <>
      <div className="Outer-container">
        <div className="sidebar">
          <Navbar />
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
