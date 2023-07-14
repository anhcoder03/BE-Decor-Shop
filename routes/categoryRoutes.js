const express = require("express");
const {
  getAllCategory,
  getOneCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const route = express.Router();
const categoryRouter = (app) => {
  route.get("/categories", getAllCategory);
  route.get("/categories/:id", getOneCategory);
  route.post("/categories", addCategory);
  route.delete("/categories/:id", deleteCategory);
  route.put("/categories/:id", updateCategory);
  return app.use("/api/v1", route);
};
module.exports = { categoryRouter };
