const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");
const User = require("./models/user");

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6124e92bd574c836541ae448")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(get404);

mongoose
  .connect("mongodb+srv://root:root@cluster0.tos8c.mongodb.net/shop?retryWrites=true&w=majority")
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Diego",
          email: "tato",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3003);
  })
  .catch((err) => console.log(err));
