const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { get404 } = require("./controllers/error");
const User = require("./models/user");

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "la irma del CAP", resave: false, saveUninitialized: false }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);

mongoose
  .connect("mongodb+srv://root:root@cluster0.tos8c.mongodb.net/shop?retryWrites=true&w=majority")
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          email: "tato@tato.com",
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
