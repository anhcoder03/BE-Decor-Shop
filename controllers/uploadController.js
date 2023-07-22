const cloudinary = require("../config/cloudinary");
const uploadImage = async (req, res) => {
  const files = req.files;
  try {
    const uploadPromises = files.map((file) => {
      if (file.mimetype.startsWith("image/")) {
        return cloudinary.uploader.upload(file.path);
      } else if (file.mimetype.startsWith("video/")) {
        return cloudinary.uploader.upload(file.path, {
          resource_type: "video",
        });
      } else {
        throw new Error("Invalid file type");
      }
    });
    const results = await Promise.all(uploadPromises);
    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));
    return res.json({ urls: uploadedFiles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteImage = async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return res
      .status(200)
      .json({ success: true, message: "Xóa ảnh thành công", result });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error deleting image" });
  }
};
module.exports = {
  uploadImage,
  deleteImage,
};
