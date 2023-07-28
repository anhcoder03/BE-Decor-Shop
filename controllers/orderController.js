const Cart = require("../models/cartModel");
const User = require("../models/authModels");
const Order = require("../models/orderModel");
const order = async (req, res) => {
  try {
    const { shippingAddress, phoneNumber, userId, totalAmount } = req.body;
    const carts = await Cart.find({ userId });
    if (!carts) {
      return res.status(400).json({
        message: "Thông tin cart không tồn tại",
      });
    }

    const newCart = await Order.create({
      userId,
      carts,
      totalAmount,
      shippingAddress,
      phoneNumber,
    });
    await Cart.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    return res.status(200).json({
      message: "Thanh toán đơn hàng thành công",
      order: newCart,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = order;
