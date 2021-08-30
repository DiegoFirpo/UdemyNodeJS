const express = require("express");
const { check } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  isAuth,
  [
    check("title").isLength({ min: 6 }).withMessage("Title too short").trim(),
    check("imageUrl").isURL().withMessage("Incorrect URL").trim(),
    check("price").isNumeric().withMessage("Price must be a number").trim(),
    check("description").isLength({ min: 20 }).withMessage("Description too short").trim(),
  ],
  adminController.postAddProduct,
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    check("title").isLength({ min: 6 }).withMessage("Title too short").trim(),
    check("imageUrl").isURL().withMessage("Incorrect URL").trim(),
    check("price").isNumeric().withMessage("Price must be a number").trim(),
    check("description").isLength({ min: 20 }).withMessage("Description too short").trim(),
  ],
  adminController.postEditProduct,
);

router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
