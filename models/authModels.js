const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("User", UserSchema);
