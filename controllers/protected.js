// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

// const User = require('../models/User')

// router.use(passport.initialize())

// const isAuthenticated = (req, res, next) => {
//   console.log(req.user)
//   if(!req.user) {
//     return res.status(403).send('Not authorized!');
//   }
//   next();
// }

// passport.use(new LocalStrategy(
//   function(email, password, done) {
//     console.log('hello')
//     User.findOne({ email: email }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//         });
//     }
// ));

// router.get('/', isAuthenticated, (req, res) => {
//   res.send('accessed')
// })





const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();



const User = require('../models/User');


router.use(express.json());

router.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['my-cookie-key']
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ email })
    .then(doc => done(null, doc))
    .catch(err => done({myError: err}, null));
});

passport.use(new LocalStrategy(
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect email' }); }
      if (user.password !== password) { return done(null, false, { message: 'Incorrect password' }); }
      done(null, user);
    });
  }
))

const isAuthenticated = (req, res, next) => {
  console.log(req.user)
  if(!req.user) {
    return res.status(403).send('Not authorized!');
  }
  next();
}

router.get('/users', (req, res) => {
  User.find()
    .then(docs => res.send(docs));
});

router.get('/', isAuthenticated, (req, res) => res.send(req.user));

// const authenticateUser = (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) { return next(err) }
//     if (!user) { return res.status(401).send(info.message) }
//     req.logIn(user, (err) => {
//       if (err) { return next(err) }
//       return res.send('Successfully authenticated');
//     });
//   })(req, res, next);
// }

// app.post('/login', authenticateUser);

// app.get('/logout', (req, res) => {
//   req.logout();
//   res.send('Successfully logged out');
// });

router.use('/addstaff', isAuthenticated, require('./addStaff'));

module.exports = router;