const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { deleteImage, uploadImage } = require("../controllers/uploadController");
const route = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Decor-shop",
    resource_type: "auto",
  },
});
const upload = multer({ storage: storage });
const uploadRouter = (app) => {
  route.post("/images/upload", upload.array("images", 10), uploadImage);
  route.delete("/images/:publicId", deleteImage);
  return app.use("/api/v1", route);
};

module.exports = uploadRouter;
