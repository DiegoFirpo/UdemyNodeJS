const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("add-product", { pageTitle: "Add product", path: "/admin/add-product" });
};

const postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
  });
};

module.exports = { getAddProduct, postAddProduct, getProducts };
