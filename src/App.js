import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Main from "./views/Main";
import Login from "./views/login/Login";
import Register from "./views/register/Register";
import Layout from "./views/userPanel/layout/Layout";
import Dashboard from "./views/userPanel/dashboard/Dashboard";
import Category from "./views/userPanel/categories/Category";
import Car from "./views/userPanel/cars/Car";

const isAuthenticated = () => {
  // to check if the user is authenticated using the JWT token
  const token = localStorage.getItem("mern-auth-token");
  return !!token;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isAuthenticated() ? (
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/categories" element={<Category />} />
                  <Route path="/cars" element={<Car />} />
                </Routes>
              </Layout>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
