const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const saltRounds = 10

const User = require('../models/User');

const authenticateUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log(info)
    if (err) { return next(err) }
    if (!user) { return res.status(401).send(info.message) }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      return res.send('Successfully authenticated');
    });
  })(req, res, next);
}

const isAuthenticated = (req, res, next) => {
  if(!req.user) {
    return res.status(403).send('Not authorized!');
  }
  next();
}

const isAdmin = (req, res, next) => {
  if(!req.user.admin) {
    return res.status(403).send('Not authorized!');
  }
  next();
}

router.post('/login', authenticateUser);

router.post('/register', isAuthenticated, isAdmin, (req, res) => {
  const { firstName, lastName, mobile, email, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  const user = new User({
    firstName,
    lastName,
    mobile,
    email,
    password: hash
  });

  user.save()
    .then(doc => {
      res.send(`${doc.firstName} has been created`);
    })
    .catch(err => res.status(401).send('bad request'))
});

router.get('/logout', (req, res) => {
  req.logout();
  res.send('Successfully logged out');
});

router.get('/me', (req, res) => {
  res.send(req.user);
});

module.exports = router;