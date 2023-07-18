const express = require("express");
const {
  getAllCategory,
  getOneCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const {authenticate} = require("../middlewares/authenticate");
const {authorization} = require("../middlewares/authorization");
const route = express.Router();

const categoryRouter = (app) => {
  route.get("/categories", getAllCategory);
  route.get("/categories/:id", getOneCategory);
  route.post("/categories",authenticate,authorization,addCategory);
  route.delete("/categories/:id", deleteCategory);
  route.put("/categories/:id", updateCategory);
  return app.use("/api/v1", route);
};
module.exports = { categoryRouter };
