import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./Account.module.css";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState(1); // 1 for phone input, 2 for OTP input
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendURL + "/forgot-password",
        { phone }
      );
      if (response.status === 200) {
        alert(`Your OTP is: ${response.data.otp}`);
        setStage(2);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendURL + "/verify-otp", {
        phone,
        otp,
      });
      if (response.status === 200) {
        alert(
          `Your username: ${response.data.username}, Your password: ${response.data.password}`
        );
        navigate("/");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      {stage === 1 ? (
        <form onSubmit={handlePhoneSubmit} className={styles.form}>
          <h3>Forgot Password</h3>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
          {errorMessage && (
            <p className={styles.invalidmessage}>{errorMessage}</p>
          )}
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className={styles.form}>
          <h3>Enter OTP</h3>
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
          {errorMessage && (
            <p className={styles.invalidmessage}>{errorMessage}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
