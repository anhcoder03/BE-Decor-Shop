const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại !",
      });
    }
    return res.json({
      message: "Lấy sản phẩm thành công !",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại !",
      });
    }
    return res.json({
      message: "Lấy sản phẩm thành công !",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const addProduct = async (req, res) => {
  const { name, image, price, desc } = req.body;
  if (!name || !image || !price || !desc) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin",
    });
  }
  try {
    const isName = await Product.findOne({ name });
    if (isName) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm đã tồn tại!",
      });
    }
    const product = await Product.create(req.body);
    await Category.findByIdAndUpdate(product.categoryId, {
      $addToSet: { products: product._id },
    });
    if (!product) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại !",
      });
    }
    return res.json({
      message: "Thêm sản phẩm thành công !",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại !",
      });
    }
    const categoryId = product.categoryId;
    await Category.findByIdAndUpdate(categoryId, {
      $pull: { products: product._id },
    });
    return res.json({
      message: "Xóa sản phẩm thành công !",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, image, price, desc } = req.body;
  if (!name || !image || !price || !desc) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đẩy đủ các trường !",
    });
  }
  try {
    const isName = await Product.findOne({ name });
    if (isName) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm đã tồn tại!",
      });
    }
    const data = await Product.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    } else {
      data.name = name;
      data.slug = slugify(name, { lower: true });
      await data.save();
      return res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công!",
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
  getAllProduct,
  getOneProduct,
  updateProduct,
  addProduct,
  deleteProduct,
};
