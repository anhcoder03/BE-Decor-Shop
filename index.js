const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const { categoryRouter } = require("./routes/categoryRoutes");
const { productRouter } = require("./routes/productRoutes");
const { UserRouter } = require("./routes/authRoutes");
const searchRouter = require("./routes/searchRoutes");
const uploadImage = require("./routes/uploadRoutes");
const { cartRouter } = require("./routes/cartRoutes");
const { orderRouter } = require("./routes/orderRoutes");
const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
categoryRouter(app);
productRouter(app);
UserRouter(app);
searchRouter(app);
uploadImage(app);
cartRouter(app);
orderRouter(app);
require("dotenv").config();
mongoose
  .connect(
    "mongodb+srv://anhnppd06356:Anh16101982@cluster0.dmqwjwx.mongodb.net/shop"
  )
  .then(() => console.log("Connected!"));
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App đang chạy trên port ${port}`);
});
