const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const saltRounds = 10

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
    const { firstName, lastName, mobile, email, password } = req.body;
    if (!firstName) {
      res.send('first name required')
    }
    if (!lastName) {
      res.send('last name required')
    }
    if (!email) {
      res.send('email required')
    }
    if (!password) {
      res.send('password required')
    }
    User.findOne({ email })
    .then(doc => {
      if (doc) {
        res.send('User already exists')
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({firstName: firstName, lastName: lastName, mobile: mobile, email: email, password: hash })
        user.save()
            .then(doc => {
                const token = generateToken(doc);
                return res.send({ token });
            })
        res.send('User successfully created')
      }
    })
 })

module.exports = router;