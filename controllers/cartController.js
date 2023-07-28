const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/authModels");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (isNaN(quantity)) {
      return res.status(400).json({
        message: "Số lượng không hợp lệ",
      });
    }
    const product = await Product.findById(productId);
    if (isNaN(product.price)) {
      return res.status(400).json({
        message: "Giá sản phẩm không hợp lệ",
      });
    }
    const existingCart = await Cart.findOne({ userId, productId });
    if (existingCart) {
      existingCart.quantity += quantity;
      existingCart.totalPrice = existingCart.quantity * product.price;
      await existingCart.save();
    } else {
      const newCart = new Cart({
        userId,
        productId,
        quantity,
        totalPrice: quantity * product.price,
      });
      await newCart.save();
    }
    const carts = await Cart.find({ userId });
    let totalAmount = 0;
    carts.forEach((cart) => {
      totalAmount += cart.totalPrice;
    });
    await User.findByIdAndUpdate(userId, { totalAmount });
    const updatedCart = await Cart.findOne({ userId, productId }).populate(
      "productId"
    );
    return res.json({
      message: "Thêm vào giỏ hàng thành công!",
      product: updatedCart.productId,
      quantity: updatedCart.quantity,
      totalAmount,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
const getAllCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const carts = await Cart.find({ userId }).populate("productId");
    if (!carts) {
      return res.status(404).json({
        message: "Lấy danh sách thất bại !",
      });
    }
    let totalQuantity = carts.length;
    let totalAmount = 0;
    carts.forEach((cart) => {
      totalAmount += cart.totalPrice;
    });
    return res.status(200).json({
      message: "Lấy danh sách thành công",
      carts,
      totalAmount,
      totalQuantity,
    });
  } catch (error) {}
};
const updateCart = async (req, res) => {
  // const id = req.params.id;
  const { userId, id, quantity } = req.body;
  try {
    const carts = await Cart.findOne({ userId, _id: id });
    if (!carts) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại !",
      });
    }
    const product = await Product.findById(carts.productId);
    carts.quantity = quantity;
    carts.totalPrice = Number(product.price) * Number(quantity);
    carts.save();
    return res.status(400).json({
      message: "Update thành công",
      carts,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addToCart,
  getAllCart,
  updateCart,
};
