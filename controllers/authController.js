const jwt = require("jsonwebtoken");
const User = require("../models/authModels") ;
const bcrypt = require("bcryptjs");

// let refreshTokens = [];

require('dotenv').config();

const signup = async(req, res) => {
    try {
        const{name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin",
            })
        }

        const userExits = await User.findOne({email})
        if(userExits){
            return res.status(400).json({
                message: "Email đã được đăng ký!!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "Đăng ký thành công ",
            user,
        });

    } catch (error) {
        console.log(error.message);
    }
};

const signin = async(req, res) => {
    try {
        const{email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin",
            })
        }

        const userExits = await User.findOne({email})
        if(!userExits){
            return res.status(400).json({
                message: "Tài khoản đã được đăng ký!!"
            })
        }

        const hashedPassword = await bcrypt.compare(password, userExits.password);

        if(!hashedPassword){
            return res.status(400).json({
                message: "Mật khẩu không đúng!!"
            })
        }

        userExits.password = undefined;

        const token = jwt.sign({_id: userExits.id}, process.env.SECRET_KEY, {expiresIn: 60 * 60 });
       

        // const refreshToken = creacteRefreshToken(userExits);
        //     refreshTokens.push(refreshToken);
        //     console.log(refreshTokens);
        //     res.cookie("refreshToken", refreshToken, {
        //         httpOnly: true,
        //         secure: true,
        //         path: "/",
        //         sameSite: "strict", 
        //     });

        return res.status(201).json({
            message: "Đăng nhập thành công ",
            accessToken: token,
            userExits,
        });

    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    signup,
    signin,
};