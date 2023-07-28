const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const request = require("request");
const moment = require("moment");
const vnp_TmnCode = "M3249576";
const vnp_HashSecret = "SNEESGGOFDLUVJDBWKIUXZXWBHPEZDOJ";
function generateTransactionReference() {
  return uuidv4();
}

const createPayment = async (req, res) => {
  let vnp_ReturnUrl = "http://localhost:8080/api/v1/payment_return";
  // try {
  //   // Dữ liệu cần gửi lên VNPay để thực hiện thanh toán
  //   const vnp_TxnRef = generateTransactionReference();
  //   const data = {
  //     vnp_TmnCode,
  //     vnp_Amount: req.body.amount * 100 || 1000000, // VNPay yêu cầu số tiền phải được nhân 100
  //     vnp_Command: "pay",
  //     vnp_CreateDate: new Date().toISOString().slice(0, 19).replace("T", " "), // Format: yyyy-MM-dd HH:mm:ss
  //     vnp_CurrCode: "VND",
  //     vnp_IpAddr:
  //       req.headers["x-forwarded-for"] ||
  //       req.connection.remoteAddress ||
  //       req.socket.remoteAddress ||
  //       req.connection.socket.remoteAddress,
  //     vnp_Locale: "vn",
  //     vnp_OrderType: "billpayment",
  //     vnp_ReturnUrl,
  //     vnp_TxnRef, // Thay bằng mã giao dịch duy nhất của bạn
  //     vnp_OrderInfo: "Truy van GD ma:" + vnp_TxnRef,
  //   };
  //   console.log(data);

  //   // Sắp xếp dữ liệu và tạo chuỗi mã hóa (hash)
  //   const sortedData = Object.keys(data)
  //     .sort()
  //     .reduce((result, key) => {
  //       result[key] = data[key];
  //       return result;
  //     }, {});

  //   const querystring = require("qs");
  //   const crypto = require("crypto");
  //   const signData = querystring.stringify(sortedData, { encode: false });
  //   const secureHash = crypto
  //     .createHmac("sha512", vnp_HashSecret)
  //     .update(signData)
  //     .digest("hex");
  //   data.vnp_SecureHash = secureHash;

  //   const response = await axios.post(
  //     vnpUrl,
  //     querystring.stringify(data, { encode: false })
  //   );
  //   res.redirect(vnpUrl);
  // } catch (error) {
  //   console.error("Error occurred:", error);
  //   res
  //     .status(500)
  //     .json({ error: "An error occurred while processing the request" });
  // }

  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require("config");

  // let tmnCode = config.get('vnp_TmnCode');
  // let secretKey = config.get('vnp_HashSecret');
  let tmnCode = "8HRDW3ZS";
  let secretKey = "SNEESGGOFDLUVJDBWKIUXZXWBHPEZDOJ";
  let returnUrl = config.get("vnp_ReturnUrl");
  let orderId = moment(date).format("DDHHmmss");
  let vnpUrl = config.get("vnp_Url"); // Sandbox URL, sử dụng URL thật khi đi vào sản xuất
  let amount = req.body.amount || 10001;
  let bankCode = req.body.bankCode || "VNBANK";

  let locale = req.body.language || "vn";
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }
  vnp_Params = sortObject(vnp_Params);
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  console.log(vnp_Params);
  res.redirect(303, vnpUrl);
};

const payMentReturn = (req, res, next) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let config = require("config");
  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    // Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    // Trả về thành công với mã trạng thái 200
    res.status(200).json({ message: "Payment success" });
  } else {
    // Trả về thất bại với mã trạng thái 400 hoặc 404
    res.status(400).json({ error: "Payment failed" });
  }
};
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = { createPayment, payMentReturn };
