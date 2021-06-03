const Coupon = require("../models/coupon");

exports.create = async (req, res) => {
  //
  const { name, expiry, discount } = req.body;
  const newCoupon = await new Coupon({ name, expiry, discount }).save();
  res.json(newCoupon);
};

exports.remove = async (req, res) => {
  //
  await Coupon.findByIdAndDelete(req.params.couponId).exec();
  res.json("OK");
};

exports.list = async (req, res) => {
  //
  const allCoupons = await Coupon.find({}).exec();
  res.json(allCoupons);
};

exports.verifyCupon = async (req, res) => {
  const { couponName } = req.body;
  const time = new Date();
  const check = await Coupon.findOne({ name: couponName }).exec();
  if (check && check.expiry.getTime() > time.getTime()) {
    res.json({ res: "OK", value: check.discount });
  } else if (check === null || check.expiry.getTime() < time.getTime()) {
    res.json({ res: "Invalid" });
  }
};
