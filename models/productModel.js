const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    slug: {
      type: String,
      slug: "name",
    },
    review_count: {
      type: Number,
      default: 0,
    },
    average_score: {
      type: Number,
      default: 0,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
