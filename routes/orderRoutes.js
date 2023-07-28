const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { authorization } = require("../middlewares/authorization");
const { order, getOrderAll } = require("../controllers/orderController");
const route = express.Router();

const orderRouter = (app) => {
  route.post("/order", order);
  route.get("/order", getOrderAll);
  return app.use("/api/v1", route);
};
module.exports = { orderRouter };
