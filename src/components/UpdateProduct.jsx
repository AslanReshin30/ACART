import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Grid, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  let [updateProduct, setUpdateProduct] = useState(null);

  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4000/products/${id}`).then((res) => {
      setUpdateProduct(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("rating.")) {
      const ratingField = name.split(".")[1];

      setUpdateProduct((prev) => ({
        ...prev,
        rating: {
          ...prev.rating,
          [ratingField]: value,
        },
      }));
    } else {
      setUpdateProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProduct),
    });
    alert("Saved successfully");
    navigate("/products");
  };

  let newStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };
  if (updateProduct !== null) {
    return (
      <Paper elevation={20} style={newStyle}>
        <center>
          <Typography variant="h5">Update Product</Typography>
        </center>
        <Grid component="form" style={{ display: "grid", gap: "20px" }}>
          <TextField
            value={updateProduct.title}
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            value={updateProduct.price}
            name="price"
            label="Price"
            type="number"
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            value={updateProduct.category}
            name="category"
            label="Category"
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                value={updateProduct.rating.rate}
                name="rating.rate"
                label="Rate"
                type="number"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                value={updateProduct.rating.count}
                name="rating.count"
                label="Count"
                type="number"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </Grid>
      </Paper>
    );
  } else {
    return <div>Loading</div>;
  }
};

export default UpdateProduct;
