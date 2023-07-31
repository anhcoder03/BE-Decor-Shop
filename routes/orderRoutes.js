const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { authorization } = require("../middlewares/authorization");
const {
  order,
  getOrderAll,
  getOrderByUserId,
  getOrderById,
  deleteOrder,
  updateOrder,
} = require("../controllers/orderController");
const route = express.Router();

const orderRouter = (app) => {
  route.post("/order", order);
  route.get("/order", getOrderAll);
  route.get("/order/:userId", getOrderByUserId);
  route.delete("/order/:id", deleteOrder);
  route.get("/orderId/:id", getOrderById);
  route.put("/order/:id", updateOrder);
  return app.use("/api/v1", route);
};
module.exports = { orderRouter };
