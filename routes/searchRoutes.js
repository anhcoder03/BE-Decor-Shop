const express = require("express");
const search = require("../controllers/searchController");
const route = express.Router();
const searchRouter = (app) => {
  route.get("/search", search);
  return app.use("/api/v1", route);
};
module.exports = searchRouter;
