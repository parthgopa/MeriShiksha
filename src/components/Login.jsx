import React, { useState } from "react";
import axios from "axios";
import styles from "./Account.module.css";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const [errormessage, seterrormessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target[0].value,
      password: e.target[1].value,
    };

    try {
      const response = await axios.post("http://localhost:5000/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        navigate("/app"); // Navigate to the home page on successful login
      } else {
        seterrormessage(response.data.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Error adding data:", error.message);
      if (error.response && error.response.data) {
        // If the backend returns an error response
        seterrormessage(error.response.data.message || "Something went wrong.");
      } else {
        // For other errors like network issues
        seterrormessage("Unable to connect to the server. Please try again.");
      }
    }
  };

  return (
    <>
      {errormessage && <p className={styles.invalidmessage}>{errormessage}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Login Here</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Email or Phone"
          id="username"
          required
          className={styles.logininput}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          required
          className={styles.logininput}
        />

        <button type="submit" className={styles.loginbutton}>
          Log In
        </button>

        <p style={{ width: "100%", marginTop: "20px" }}>
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
        <p style={{ width: "100%", marginTop: "20px", textAlign: "center" }}>
          <Link to="/forgot-password">Forget Password ?</Link>
        </p>
      </form>
    </>
  );
};

export default Login;
