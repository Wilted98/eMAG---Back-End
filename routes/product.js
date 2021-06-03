const express = require("express");
const router = express.Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  create,
  read,
  getPrductsByCat,
  getProductBySlug,
  leaveratingandcomment,
  searchFilters,
  searchQuery,
  leavemaindescription,
  getDescription,
  addspecs,
  getspecs,
  getratingandcomment,
  likeAndUnlike,
  getProductsByCat,
  updateQuantity,
} = require("../controllers/product");

//routes

router.post("/product", authCheck, adminCheck, create);
router.get("/products", read);
router.post("/homepageproducts", getPrductsByCat);
router.post("/homepageproduct", getProductsByCat);
router.post("/:slug", getProductBySlug);
router.put("/leaveratingandcomment", authCheck, leaveratingandcomment);
router.put("/getratingandcomment", authCheck, getratingandcomment);

//Search

router.post("/search/filters", searchFilters);
router.post("/search/query", searchQuery);

//main description
router.post(
  "/admin/add-description",
  authCheck,
  adminCheck,
  leavemaindescription
);
router.post("/admin/get-description", getDescription);

//product specs

router.post("/admin/add-specs", authCheck, adminCheck, addspecs);
router.post("/admin/get-specs", getspecs);

//comment like
router.post("/comment/likeandunlike", authCheck, likeAndUnlike);

//Update Quantity

router.put("/productupdate/quantity", updateQuantity);

module.exports = router;
