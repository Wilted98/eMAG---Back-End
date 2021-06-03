const express = require("express");
const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//controllers
const { create, remove, list, verifyCupon } = require("../controllers/coupon");

router.post("/admin/coupon", authCheck, adminCheck, create);
router.get("/admin/coupons", list);
router.delete("/admin/:couponId", authCheck, adminCheck, remove);
router.post("/user/coupon", verifyCupon);

module.exports = router;
