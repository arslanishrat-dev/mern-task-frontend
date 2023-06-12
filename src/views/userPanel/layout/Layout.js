import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => (
  <>
    <Sidebar />
    <Box flex={1}>
      <Header />
      <div style={{ marginLeft: 240 }}>{children}</div>
    </Box>
  </>
);

export default Layout;
