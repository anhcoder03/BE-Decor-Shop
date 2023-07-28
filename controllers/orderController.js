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

const getOrderAll = async (req, res) => {
  let { page = 1 } = req.query;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  try {
    const orders = await Order.find()
      .skip((+page - 1) * limit)
      .limit(limit)
      .populate("userId");
    const totalOrder = await Order.count();
    const totalPage = Math.ceil(totalOrder / +limit);
    return res.status(200).jsonp({
      success: true,
      message: "Good job",
      orders,
      totalPage,
      totalOrder,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
module.exports = { getOrderAll, order };
