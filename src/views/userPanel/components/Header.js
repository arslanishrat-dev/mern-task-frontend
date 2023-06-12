import React from "react";
import { Box, Typography } from "@mui/material";
import jwtDecode from "jwt-decode";

const decodeToken = (token) => {
  try {
    // Decode the token
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const Header = () => {
  // Decode the JWT token to get the user's name
  const token = localStorage.getItem("mern-auth-token");
  const decodedToken = decodeToken(token);
  const userName = decodedToken ? decodedToken.user.name : "";

  return (
    <Box p={2} borderBottom="1px solid #ccc" textAlign={"right"}>
      <Typography variant="h6" component="h2" textTransform={"capitalize"}>
        Welcome, {userName}
      </Typography>
    </Box>
  );
};

export default Header;
