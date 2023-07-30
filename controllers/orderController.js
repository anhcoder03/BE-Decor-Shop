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
const getOrderByUserId = async (req, res) => {
  const userId = req.params.userId;
  let { page = 1 } = req.query;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  try {
    const orders = await Order.find({ userId })
      .skip((+page - 1) * limit)
      .limit(limit);
    const totalOrder = await Order.count({ userId });
    const totalPage = Math.ceil(totalOrder / +limit);
    if (!orders) {
      res.status(404).json({
        message: "Không tìm thấy dữ liệu",
      });
    }
    res.status(200).json({
      message: "Lấy dữ liệu thành công",
      orders,
      totalOrder,
      totalPage,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getOrderById = async (req, res) => {
  const id = req.params.id;
  try {
    const orders = await Order.findById(id);
    if (!orders) {
      res.status(404).json({
        message: "Không tìm thấy dữ liệu",
      });
    }
    res.status(200).json({
      message: "Lấy dữ liệu thành công",
      orders,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    await Order.findByIdAndRemove(id);
    return res.status(200).json({
      message: "Huỷ đơn hàng thành công",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getOrderAll,
  order,
  getOrderByUserId,
  getOrderById,
  deleteOrder,
};
