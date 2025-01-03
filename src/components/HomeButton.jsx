import { useNavigate } from "react-router";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      style={{ position: "fixed", top: "10px", left: "10px", zIndex: "0" }}
      className="btn btn-warning"
      onClick={() => {
        console.log("Navigating to /functionalities");
        navigate("/functionalities");
      }}
    >
      Home
    </button>
  );
};
export default HomeButton;
