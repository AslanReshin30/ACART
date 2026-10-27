import React, { useState } from "react";
import { Paper, Typography, TextField, Grid, Button } from "@mui/material";

const NewProduct = () => {
  let [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description:
      "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
    category: "",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
    rating: {
      rate: "",
      count: "",
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("rating.")) {
      const ratingField = name.split(".")[1];

      setNewProduct((prev) => ({
        ...prev,
        rating: {
          ...prev.rating,
          [ratingField]: value,
        },
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    alert("Your product recorded successfully");
    setNewProduct({
      title: "",
      price: "",
      description:
        "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
      category: "",
      image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
      rating: {
        rate: "",
        count: "",
      },
    });
  };

  let newStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };
  return (
    <Paper elevation={20} style={newStyle}>
      <center>
        <Typography variant="h5">Create New Product</Typography>
      </center>
      <Grid component="form" style={{ display: "grid", gap: "20px" }}>
        <TextField
          value={newProduct.title}
          name="title"
          label="Title"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          value={newProduct.price}
          name="price"
          label="Price"
          type="number"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          value={newProduct.category}
          name="category"
          label="Category"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              value={newProduct.rating.rate}
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
              value={newProduct.rating.count}
              name="rating.count"
              label="Count"
              type="number"
              variant="outlined"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Grid>
    </Paper>
  );
};

export default NewProduct;
