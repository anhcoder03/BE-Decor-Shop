const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/authModels");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // Kiểm tra giá trị quantity có hợp lệ không
    if (isNaN(quantity)) {
      return res.status(400).json({
        message: "Số lượng không hợp lệ",
      });
    }
    // Lấy thông tin sản phẩm từ CSDL
    const product = await Product.findById(productId);
    // Kiểm tra giá trị product.price có hợp lệ không
    if (isNaN(product.price)) {
      return res.status(400).json({
        message: "Giá sản phẩm không hợp lệ",
      });
    }
    // Kiểm tra xem giỏ hàng đã tồn tại hay chưa
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
    // Cập nhật tổng số tiền của người dùng
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

module.exports = addToCart;
