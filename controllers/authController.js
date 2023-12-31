const jwt = require("jsonwebtoken");
const User = require("../models/authModels");
const bcrypt = require("bcryptjs");

let refreshTokens = [];

require("dotenv").config();
const createAccessToken = (payload) => {
  return jwt.sign(
    { id: payload._id, admin: payload.admin },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
const createRefreshToken = (payload) => {
  return jwt.sign(
    { id: payload._id, admin: payload.admin },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({
        message: "Email đã được đăng ký!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Đăng ký thành công ",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Sai tài khoản đăng nhập!",
      });
    }
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) {
      return res.status(400).json({
        message: "Mật khảu không khớp!",
      });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    user.password = undefined;
    return res.status(201).json({
      message: "Đăng nhập thành công ",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getAllUser = async (req, res) => {
  let { page = 1 } = req.query;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  try {
    const user = await User.find()
      .skip((+page - 1) * limit)
      .limit(limit);
    const totalUser = await User.count();
    const totalPage = Math.ceil(totalUser / +limit);
    if (!user) {
      return res.status(400).json({
        message: "Lấy danh sách user thất bại",
      });
    }
    return res.json({
      message: "Lấy danh sách user thành công",
      user,
      totalUser,
      totalPage,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(400).json({
        message: "user không tồn tại !",
      });
    }
    return res.json({
      message: "Xóa user thành công !",
      user,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  signin,
  getAllUser,
  deleteUser,
};
