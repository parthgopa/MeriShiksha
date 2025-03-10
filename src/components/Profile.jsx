import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Account.module.css";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile");
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        setMessage(
          error.response ? error.response.data.message : error.message
        );
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/update-profile",
        user
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Profile</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={user.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={user.phone}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Profile</button>

        {message && <p className={styles.invalidmessage}>{message}</p>}
      </form>
    </div>
  );
};

export default Profile;
