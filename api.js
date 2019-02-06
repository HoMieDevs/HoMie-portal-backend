require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = new express();
const cors = require("cors");
// const db = require("./config/keys").mongoURI;
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000"
    // origin: "https://homie-portal-au.netlify.com/"
  })
);

const User = require("./models/User");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["my-cookie-key"]
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ email })
    .then(doc => done(null, doc))
    .catch(err => done({ myError: err }, null));
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      console.log("RUNNING PASSPORT");
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect credentials" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect credentials" });
        }
        return done(null, user);
      });
    }
  )
);

app.use(require("./controllers"));

const port = process.env.PORT || 5000;

// const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
