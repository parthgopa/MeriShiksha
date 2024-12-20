import exampleImage from "../assets/MyLogo.png";
import styles from './CompanyName.module.css';
import Header from './Header';


const CompanyName = () => {
  return (
    <div className={styles.companyHeading}>
      <img src={exampleImage} alt="Company Logo" className={styles.Companylogo} />
      <p className={styles.companyName}>Parth InfoSoft</p>
      <Header className={styles.header}/>
    </div>
  );
};
export default CompanyName;
