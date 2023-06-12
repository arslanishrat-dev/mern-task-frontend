import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { ApiWrapper } from "../../../utils/ApiWrapper";

const Dashboard = () => {
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [carsCount, setCarsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiWrapper("GET", "dashboard/data");

        if (response.status === 200) {
          setCategoriesCount(response.data.data.categoriesCount);
          setCarsCount(response.data.data.carsCount);
        } else {
          console.log("failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <Typography variant="h3" gutterBottom>
            {categoriesCount}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Cars
          </Typography>
          <Typography variant="h3" gutterBottom>
            {carsCount}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
