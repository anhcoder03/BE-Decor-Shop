const jwt = require("jsonwebtoken");
const User = require("../models/authModels");
require("dotenv").config();

const authenticate = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
          throw new Error("Bạn cần đăng nhập để thực hiện chức năng");
        }

        const token = authHeader && authHeader.split(" ")[1];
        const secretKey = process.env.ACCESS_TOKEN_SECRET;

        const{ id } = jwt.verify(token, secretKey);
     
        const user = await User.findById(id);
       
        if(!user){
          throw new Error("Không tìm thấy người dùng");
        }
        req.user = user;
            next();
          
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};
 module.exports = {
  authenticate
 }