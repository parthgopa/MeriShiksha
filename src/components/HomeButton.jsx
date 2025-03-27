import { useNavigate } from "react-router";
import { IoHome } from "react-icons/io5";
import React from "react";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      style={{
        position: "fixed",
        top: "15px",
        left: "15px",
        zIndex: "1000",
        height: "40px",
        width: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #06b6d4, #4a1d96)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        fontSize: "1.2rem",
        padding: "0",
      }}
      onClick={() => {
        navigate("/");
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "linear-gradient(135deg, #4a1d96, #18181b)";
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.4)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "linear-gradient(135deg, #06b6d4, #4a1d96)";
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
      }}
    >
      <IoHome />
    </button>
  );
};
export default HomeButton;
