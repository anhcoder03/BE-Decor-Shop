const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { authorization } = require("../middlewares/authorization");
const {
  addToCart,
  getAllCart,
  updateCart,
} = require("../controllers/cartController");
const route = express.Router();

const cartRouter = (app) => {
  route.post("/cart", addToCart);
  route.get("/cart/:userId", getAllCart);
  route.put("/cart", updateCart);
  return app.use("/api/v1", route);
};
module.exports = { cartRouter, getAllCart };
