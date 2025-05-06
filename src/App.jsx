import "./App.css";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Danger from "./components/Danger";
import "index.css";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
