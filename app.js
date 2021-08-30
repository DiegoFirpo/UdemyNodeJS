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
const { get404, get500 } = require("./controllers/error");
const User = require("./models/user");

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "la irma del CAP", resave: true, saveUninitialized: true, cookie: { secure: false } }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  console.log(req.session);
  
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      req.session.isLoggedIn = true;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", get500);
app.use(get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", { pageTitle: "Error!", path: "/500", isAuthenticated: req.session.isLoggedIn });
});

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
