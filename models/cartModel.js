const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    totalPrice: {
      type: Number,
      require: true,
    },
    totalAmount: {
      type: Number,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
module.exports = mongoose.model("Cart", cartSchema);
