import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const SidebarContainer = styled("div")({
  width: 240,
});

const SidebarHeading = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mern-auth-token");
    navigate("/login");
  };

  return (
    <Drawer variant="permanent" anchor="left">
      <SidebarContainer>
        <SidebarHeading component="h1" variant="h6" gutterBottom>
          Dashboard
        </SidebarHeading>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/categories">
            <ListItemText primary="Categories" />
          </ListItem>
          <ListItem button component={Link} to="/cars">
            <ListItemText primary="Cars" />
          </ListItem>
        </List>
        <LogoutButton variant="outlined" onClick={handleLogout}>
          Logout
        </LogoutButton>
      </SidebarContainer>
    </Drawer>
  );
};

export default Sidebar;
