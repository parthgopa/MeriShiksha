import { useNavigate } from "react-router";
import { IoHome } from "react-icons/io5";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      style={{
        position: "fixed",
        top: "15px",
        left: "15px",
        zIndex: "0",
        height: "33px",
        width: "100",
      }}
      className="btn btn-info"
      onClick={() => {
        navigate("/");
      }}
    >
      <IoHome />
    </button>
  );
};
export default HomeButton;
