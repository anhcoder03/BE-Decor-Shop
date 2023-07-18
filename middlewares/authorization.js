const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorization = async(req, res, next) => {
    
    try {
        const authHeader = req.headers.authorization;
        
        const token = authHeader && authHeader.split(" ")[1];
        const secretKey = process.env.ACCESS_TOKEN_SECRET;

        const{ admin } = jwt.verify(token, secretKey);
        
        if(!admin || admin !== true){
            throw new Error("Bạn không có quyền thực hiện chức năng này!");
        }  
        next();
    } catch (error) {
        return res.status(501).json({
            message: error.message
        })
    }
};

 module.exports = {
    authorization
}