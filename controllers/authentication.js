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
      return res.send({message: 'Successfully authenticated', admin: user.admin});
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

router.get('/unavailibility', isAuthenticated, isAdmin, (req, res) => {
  const allUnavail = []

  User.find({})
    .then(staff => {
      staff.forEach(doc => {
        const user = doc.firstName
        const unavail = doc.unavailability
        allUnavail.push({user, unavail})
      })
      res.send(allUnavail)
    })

})

router.get('/unavailibility/:id', isAuthenticated, (req, res) => {
  const id = req.params.id
  
  User.findOne({
    "_id": id
  }, function(err, user) {
    res.send(user.unavailability)
  })
  
})

router.put('/unavailability/:id', isAuthenticated,  (req, res) => {
  const _id = req.params.id
  const { unavailability } = req.body

  User.findOneAndUpdate(
      { _id },
      { $push: {unavailability} },
      {
          new: true,
          runValidators: true
      }
  )
  .then(doc => res.send(doc));

})

router.delete('/unavailability/:id/:unid', isAuthenticated,  (req, res) => {
  const id = req.params.id
  const unid = req.params.unid
  
  User.findOne({
    "_id": id
  }, function(err, user) {
    user.unavailability.forEach(un => {
      if(un._id == unid) {
        user.unavailability.remove(un)
        user.save()
      }
    })
    res.send(user)
  })

})

router.get('/roster', isAuthenticated, (req,res)=>{
  Roster.find({})
        .then(doc => {
          return res.send(doc)
    })
});

router.get('/roster/:id/', isAuthenticated, (req,res)=>{
    const { id } = req.params;
    Roster.findOne({
      "_id": id
    }, function(err, roster) {
      res.send(roster);
    });
});

router.post('/roster', isAuthenticated, isAdmin, (req, res) => {
  const { date, location, staff } = req.body;
  
  const roster = new Roster({
    date,
    location,
    staff
  });

// get the staffMember input and compare it to user model id

  roster.save()
    .then(doc => {
      console.log(doc.staff)
      res.send("roster has been created");
    })
    .catch(err => res.status(401).send(err))
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