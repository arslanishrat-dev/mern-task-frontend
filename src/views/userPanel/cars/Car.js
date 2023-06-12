import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Modal,
  TextField,
  Typography,
  Box,
  Alert,
  MenuItem,
} from "@mui/material";
import { ApiWrapper } from "../../../utils/ApiWrapper";
import "./Car.css";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [newCar, setNewCar] = useState({
    catId: "",
    color: "",
    model: "",
    make: "",
    registration: "",
  });
  const [categories, setCategories] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [totalCarsCount, setTotalCarsCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiWrapper("GET", "category/all?limit=100");

        if (response.status === 200) {
          setCategories(response.data.data);
        } else {
          setError(response.data.msg);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await ApiWrapper(
          "GET",
          `car/all?page=${page + 1}&limit=${rowsPerPage}`
        );

        if (response.status === 200) {
          setCars(response.data.data);
          setTotalCarsCount(
            response.data.pagination.pages *
              response.data.pagination.records_per_page
          );
        } else {
          setError(response.data.msg);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchCars();
  }, [page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCars = cars.filter((car) =>
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCars = filteredCars.sort((a, b) =>
    a.model.localeCompare(b.model)
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCar({
      category: "",
      color: "",
      model: "",
      make: "",
      registration: "",
    });
    setSelectedCar(null);
    setError("");
  };

  const handleCarChange = (event, fieldName) => {
    setNewCar({
      ...newCar,
      [fieldName]: event.target.value,
    });
  };

  const handleAddCar = async () => {
    try {
      const response = await ApiWrapper("POST", "car/add", newCar);

      if (response.status === 201) {
        setCars([...cars, response.data.data]);
        handleCloseModal();
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const handleEditCar = async () => {
    try {
      const response = await ApiWrapper(
        "PUT",
        `car/${selectedCar._id}`,
        newCar
      );

      if (response.status === 200) {
        const updatedCars = cars.map((car) =>
          car._id === response.data.data._id ? response.data.data : car
        );
        setCars(updatedCars);
        handleCloseModal();
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("Error editing car:", error);
    }
  };

  const handleDeleteCar = async () => {
    try {
      const response = await ApiWrapper("DELETE", `car/${selectedCar._id}`);

      if (response.status === 200) {
        setCars(cars.filter((car) => car._id !== selectedCar._id));
        setDeleteConfirmation(false);
        setSelectedCar(null);
      } else {
        console.error("Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button variant="contained" onClick={handleOpenModal}>
          Add Car
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Color</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Make</TableCell>
            <TableCell>Registration No</TableCell>
            <TableCell>Category</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCars.map((car) => (
            <TableRow key={car._id}>
              <TableCell style={{ textTransform: "capitalize" }}>
                {car.color}
              </TableCell>
              <TableCell style={{ textTransform: "capitalize" }}>
                {car.model}
              </TableCell>
              <TableCell style={{ textTransform: "capitalize" }}>
                {car.make}
              </TableCell>
              <TableCell style={{ textTransform: "capitalize" }}>
                {car.registration}
              </TableCell>
              <TableCell style={{ textTransform: "capitalize" }}>
                {car.cat_id.title}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleOpenModal();
                    setSelectedCar(car);
                    setNewCar({
                      color: car.color,
                      model: car.model,
                      make: car.make,
                      registration: car.registration,
                      catId: car.cat_id._id,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setDeleteConfirmation(true);
                    setSelectedCar(car);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCarsCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <Typography variant="h6" gutterBottom>
            {selectedCar ? "Edit Car" : "Add Car"}
          </Typography>
          <Box mt={2}>
            <TextField
              label="Color"
              variant="outlined"
              size="small"
              defaultValue={selectedCar ? selectedCar.color : newCar.color}
              onChange={(event) => handleCarChange(event, "color")}
              fullWidth
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Model"
              variant="outlined"
              size="small"
              defaultValue={selectedCar ? selectedCar.model : newCar.model}
              onChange={(event) => handleCarChange(event, "model")}
              fullWidth
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Make"
              variant="outlined"
              size="small"
              defaultValue={selectedCar ? selectedCar.make : newCar.make}
              onChange={(event) => handleCarChange(event, "make")}
              fullWidth
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Registration No"
              variant="outlined"
              size="small"
              defaultValue={
                selectedCar ? selectedCar.registration : newCar.registration
              }
              onChange={(event) => handleCarChange(event, "registration")}
              fullWidth
            />
          </Box>
          <Box mt={2}>
            <TextField
              select
              label="Category"
              variant="outlined"
              size="small"
              defaultValue={selectedCar ? selectedCar.cat_id._id : newCar.catId}
              onChange={(event) => handleCarChange(event, "catId")}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.title}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
            {selectedCar ? (
              <>
                <Button variant="contained" onClick={handleEditCar}>
                  Save Changes
                </Button>
                <Button variant="contained" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleAddCar}>
                Add
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <Modal
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Delete Car
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this car?
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleDeleteCar}>
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => setDeleteConfirmation(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Car;
