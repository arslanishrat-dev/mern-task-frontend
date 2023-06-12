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
} from "@mui/material";
import { ApiWrapper } from "../../../utils/ApiWrapper";
import "./Categories.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);
  const [error, setError] = useState("");

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiWrapper(
          "GET",
          `category/all?page=${page + 1}&limit=${rowsPerPage}`
        );

        if (response.status === 200) {
          setCategories(response.data.data);
          setTotalCategoriesCount(
            response.data.pagination.pages *
              response.data.pagination.records_per_page
          );
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchCategories();
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

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCategories = filteredCategories.sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCategory("");
    setSelectedCategory(null);
    setError("");
  };

  const handleCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const handleAddCategory = async () => {
    try {
      const response = await ApiWrapper("POST", "category/add", {
        title: newCategory,
      });

      if (response.status === 201) {
        setCategories([...categories, response.data.data]);
        handleCloseModal();
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await ApiWrapper(
        "PUT",
        `category/${selectedCategory._id}`,
        {
          title: newCategory,
        }
      );

      if (response.status === 200) {
        const updatedCategories = categories.map((category) =>
          category._id === response.data.data._id
            ? response.data.data
            : category
        );
        setCategories(updatedCategories);
        handleCloseModal();
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await ApiWrapper(
        "DELETE",
        `category/${selectedCategory._id}`
      );

      if (response.status === 200) {
        setCategories(
          categories.filter((category) => category._id !== selectedCategory._id)
        );
        setDeleteConfirmation(false);
        setSelectedCategory(null);
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
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
          Add Category
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCategories.map((category) => (
            <TableRow key={category._id}>
              <TableCell style={{ textTransform: "capitalize" }}>
                {category.title}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleOpenModal();
                    setSelectedCategory(category);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setDeleteConfirmation(true);
                    setSelectedCategory(category);
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
        count={totalCategoriesCount} // Replace with the total count of categories from the API
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
            {selectedCategory ? "Edit Category" : "Add Category"}
          </Typography>
          <TextField
            label="Category Name"
            variant="outlined"
            size="small"
            defaultValue={
              selectedCategory ? selectedCategory.title : newCategory
            }
            onChange={handleCategoryChange}
            fullWidth
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            {selectedCategory ? (
              <>
                <Button variant="contained" onClick={handleEditCategory}>
                  Save Changes
                </Button>
                <Button variant="contained" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleAddCategory}>
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
            Delete Category
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this category?
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleDeleteCategory}>
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

export default Category;
