const express = require("express");
const router = express.Router();

const { authCheck } = require("../middlewares/auth");
const {
  updateImgProfile,
  getImageProfile,
  updateUserProfile,
} = require("../controllers/user");

router.put("/update-img-profile", authCheck, updateImgProfile);
router.put("/update-user-profile", authCheck, updateUserProfile);
router.get("/get-image-profile", getImageProfile);

module.exports = router;
