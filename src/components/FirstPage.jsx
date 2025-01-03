import firstpage from "../assets/firstpage.jpg";
import Danger from "./Danger";
import styles from "./FirstPage.module.css";
import { Link, useNavigate } from "react-router";
const FirstPage = () => {
  const navigate = useNavigate();
  const handleOnClickevent = () => {
    navigate("/functionalities");
  };
  return (
    <>
      <div className={styles.imagecontainer}>
        <img src={firstpage} className={styles.backgroundimage} />
        <button className={styles.overlaybutton} onClick={handleOnClickevent}>
          Click
        </button>
      </div>
    </>
  );
};
export default FirstPage;
