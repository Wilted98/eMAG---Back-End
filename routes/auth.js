const express = require("express");
const router = express.Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const { createOrUpdateUser, currentUser } = require("../controllers/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/admin-check", authCheck, adminCheck, currentUser);

module.exports = router;
