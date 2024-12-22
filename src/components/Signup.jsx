import axios from "axios";
import { useState } from "react";
import styles from "./Account.module.css";
import { Link, useNavigate } from "react-router";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target[0].value,
      email: e.target[1].value,
      phone: e.target[2].value,
      password: e.target[3].value,
    };

    try {
      const response = await axios.post("http://localhost:5000/sign-up", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        navigate("/"); // Redirect to the login page.
      }
      setErrorMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.error("Error adding data:", error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Sign-Up</h3>

        <label htmlFor="username" className={styles.signuplabel}>
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          className={styles.signupinput}
          required
        />

        <label htmlFor="email" className={styles.signuplabel}>
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          className={styles.signupinput}
          required
        />

        <label htmlFor="phone" className={styles.signuplabel}>
          Phone
        </label>
        <input
          type="number"
          placeholder="Phone No."
          className={styles.signupinput}
          required
        />

        <label htmlFor="password" className={styles.signuplabel}>
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          className={styles.signupinput}
          required
        />

        <button type="submit" className={styles.signupbutton}>
          Sign-Up
        </button>

        <p>
          Already Registered ? <Link to="/">Log In</Link>
        </p>

        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </>
  );
};

export default Signup;
