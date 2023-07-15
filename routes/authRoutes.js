const express = require("express");
const {
    signup,
    signin,
} = require("../controllers/authController");

const route = express.Router();
const UserRouter = (app) => {
    route.post("/signup", signup);
    route.post("/signin", signin);
    return app.use("/api/v1", route);
};

module.exports = {UserRouter};