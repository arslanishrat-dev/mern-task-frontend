import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ApiWrapper } from "../../utils/ApiWrapper";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);

      const response = await ApiWrapper("POST", "auth/register", user);

      if (response.status === 201) {
        setRegistrationSuccess(true);
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (registrationSuccess) {
    return (
      <div className="register-screen">
        <div className="register-form-container">
          <Typography variant="h6">Registration Successful!</Typography>
          <Typography variant="body1">
            Password has been sent to your email for sign in.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Go to Login Screen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-screen">
      {error && <Alert severity="error">{error}</Alert>}
      <div className="register-form-container">
        <Typography variant="h6" className="register-heading">
          Register
        </Typography>
        <form className="register-form">
          <TextField
            label="Name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
