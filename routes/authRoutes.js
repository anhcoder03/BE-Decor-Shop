const express = require("express");
const {
  signup,
  signin,
  getAllUser,
  deleteUser,
} = require("../controllers/authController");

const route = express.Router();
const UserRouter = (app) => {
  route.post("/signup", signup);
  route.post("/signin", signin);
  route.get("/user", getAllUser);
  route.delete("/user/:id", deleteUser);
  return app.use("/api/v1", route);
};

module.exports = { UserRouter };
