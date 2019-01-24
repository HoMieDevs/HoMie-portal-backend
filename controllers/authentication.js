const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const generateToken = (user) => {
  const token = jwt.sign(
    { email: user.email },
    'coder-academy', // jwt secret
    { expiresIn: '1h' }
  );
  return token;
}

router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (email) {
    User.findOne({ email })
      .then(doc => {
        if (!doc) {
          return res.status(403).send('Bad credentials');
        }
        if (!bcrypt.compareSync(password, doc.password)) {
            return res.send('Bad credentials')
        }
        const token = generateToken(doc);
        return res.send({ token });
      });
  } else {
    return res.status(403).send('Bad credentials');
  }
});

module.exports = router;