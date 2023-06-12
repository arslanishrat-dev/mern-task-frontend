import React, { useState } from "react";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { ApiWrapper } from "../../utils/ApiWrapper";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await ApiWrapper("POST", "auth/login", credentials);

      if (response.status === 200) {
        const token = response.data.token;

        localStorage.setItem("mern-auth-token", token);
        navigate("/dashboard");
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  return (
    <div className="login-screen">
      {error && <Alert severity="error">{error}</Alert>}
      <div className="login-form-container">
        <Typography variant="h6" className="login-heading">
          Login
        </Typography>
        <form className="login-form">
          <TextField
            label="Email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
          />
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
