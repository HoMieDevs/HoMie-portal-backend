const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const saltRounds = 10

const User = require('../models/User');
const Roster = require('../models/Roster');

const authenticateUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(401).send(info.message) }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      console.log(user)
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
    console.log(req.user)
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

router.post('/roster', isAuthenticated, isAdmin, (req, res) => {
  const { date, location, staff } = req.body;
  const { date, location, staff} = req.body;
  const roster = new Roster({
    date,
    location,
    staff
  });

  roster.save()
    .then(doc => {
      res.send(`${doc.location} has been created`);
    })
    .catch(err => res.status(401).send(err))
});

router.get('/unavailibility', (req, res) => {
  console.log(req.user)
  // const { date, allDay, startTime, endTime, comment, approved } = req.body;
  
})

router.put('/unavailibility', (req, res) => {
  
})

router.get('/roster/:id/', (req,res)=>{
    const { id } = req.params;
    console.log(id)
    Roster.findOne({
      "_id": id
    }, function(err, roster) {
      res.send(roster);
      console.log(roster)
    });
});

router.put('/roster/:id', isAuthenticated, isAdmin, (req, res) => {
    const _id = req.params.id
    const { date, location, staff } = req.body

    Roster.findOneAndUpdate(
        { _id },
        { date, location, staff },
        {
            new: true,
            runValidators: true
        }
    )
    .then(doc => res.send(doc));

})


router.get('/logout', (req, res) => {
  req.logout();
  res.send('Successfully logged out');
});

router.get('/me', (req, res) => {
  res.send(req.user);
});

module.exports = router;