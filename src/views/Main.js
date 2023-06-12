import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to MERN App
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        This application is just for the testing purpose
      </Typography>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Button
          variant="contained"
          component={Link}
          to="/login"
          sx={{ marginRight: 2 }}
        >
          Login
        </Button>
        <Button variant="contained" component={Link} to="/register">
          Register
        </Button>
      </div>
    </Container>
  );
};

export default Main;
