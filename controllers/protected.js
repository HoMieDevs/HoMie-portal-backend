const express = require('express');
const router = express.Router();
const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
  if(!req.user) {
    return res.status(403).send('Not authorized!');
  }
  next();
}

router.use(isAuthenticated);

router.get('/users', (req, res) => {
  User.find()
    .then(docs => {
      console.log("getting staff")
      res.send(docs)
    });
});

module.exports = router;