const Product = require("../models/productModel");
const search = async (req, res) => {
  const searchTerm = req.query.key;
  if (!searchTerm) {
    return res.status(400).json({ error: "Missing search term" });
  }
  try {
    const results = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    });
    if (results.length == 0) {
      return res.status(400).json({ error: "Không có sản phẩm nào" });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Error searching products" });
  }
};
module.exports = search;
