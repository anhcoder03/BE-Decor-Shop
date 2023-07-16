const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const slugify = require("slugify");
const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();
    if (!category) {
      return res.status(400).json({
        message: "Danh mục không tồn tại !",
      });
    }
    return res.json({
      message: "Lấy danh mục thành công !",
      category,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const getOneCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );
    if (!category) {
      return res.status(400).json({
        message: "Danh mục không tồn tại !",
      });
    }
    return res.json({
      message: "Lấy danh mục thành công !",
      category,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const addCategory = async (req, res) => {
  const formData = req.body;
  if (!formData.name) {
    return res.status(400).json({
      success: false,
      message: "Phải nhập tên danh mục!",
    });
  }
  try {
    const isName = await Category.findOne({ name: formData.name });
    if (isName) {
      return res.status(400).json({
        success: false,
        message: "Danh mục đã tồn tại!",
      });
    }
    const category = await Category.create(req.body);
    if (!category) {
      return res.status(400).json({
        message: "Danh mục không tồn tại !",
      });
    }
    return res.json({
      message: "Thêm danh mục thành công !",
      category,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    await Product.deleteMany({ categoryId: req.params.id });
    if (!category) {
      return res.status(400).json({
        message: "Danh mục không tồn tại !",
      });
    }
    return res.json({
      message: "Xóa danh mục thành công !",
      category,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const formData = req.body;
  if (!formData.name) {
    return res.status(400).json({
      success: false,
      message: "Phải nhập tên danh mục!",
    });
  }
  try {
    const isName = await Category.findOne({ name: formData.name });
    if (isName) {
      return res.status(400).json({
        success: false,
        message: "Danh mục đã tồn tại!",
      });
    }
    const data = await Category.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    } else {
      data.name = formData.name;
      data.slug = slugify(formData.name, { lower: true });
      await data.save();
      return res.status(200).json({
        success: true,
        message: "Cập nhật danh mục thành công!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  getAllCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
  addCategory,
};
