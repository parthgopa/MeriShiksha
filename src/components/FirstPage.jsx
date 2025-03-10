import firstpage from "../assets/firstpage.jpg";
import styles from "./FirstPage.module.css";
import { useNavigate } from "react-router";
// import LoadingSpinner from "./LoadingSpinner";
// import VisitorCounter from "./VisitorCounter";
const FirstPage = () => {
  const navigate = useNavigate();
  const handleOnClickevent = () => {
    navigate("/");
  };
  return (
    <>
      {/* <LoadingSpinner></LoadingSpinner> */}
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
