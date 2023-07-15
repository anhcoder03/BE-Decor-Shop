const express = require("express");
const {
  getAllProduct,
  getOneProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const route = express.Router();
const productRouter = (app) => {
  route.get("/products", getAllProduct);
  route.get("/products/:id", getOneProduct);
  route.post("/products", addProduct);
  route.delete("/products/:id", deleteProduct);
  route.put("/products/:id", updateProduct);
  return app.use("/api/v1", route);
};
module.exports = { productRouter };
