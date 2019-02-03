const express = require("express");
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
      return res.send({message: 'Successfully authenticated', userId: user._id, admin: user.admin});
    });
  })(req, res, next);
};

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("Not authorized!");
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user.admin) {
    return res.status(403).send("Not authorized!");
  }
  next();
};

router.post("/login", authenticateUser);

router.post("/register", isAuthenticated, isAdmin, (req, res) => {
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

  user
    .save()
    .then(doc => {
      res.send(`${doc.firstName} has been created`);
    })
    .catch(err => res.status(401).send("bad request"));
});

router.get("/staff/store/:date", isAuthenticated, isAdmin, (req,res) =>{
  const shiftDate = req.params.date;
  const allStaff = []
  User.find({}).then(staff => {
    staff.forEach(doc => {
      if (doc.store) {
        const id = doc._id
        const firstName = doc.firstName;
        const lastName = doc.lastName;
        const unavail = [];
        doc.unavailability.forEach(unav => {
          if (unav){
          if (unav.date) {
            if (unav.date.toISOString() == shiftDate) {
              const unaId = unav._id
              const date = unav.date
              const allDay = unav.allDay
              const startTime = unav.startTime
              const endTime = unav.endTime
              const matchUnavail = {unaId, date, allDay, startTime, endTime}
              unavail.push(matchUnavail)
            }
           } else {null}
          } else {null}
        })
        allStaff.push({ id, firstName, lastName, unavail });
      } else {null }
    });
    res.send({ allStaff: allStaff });  
  })
  .catch(err => res.status(401).send(err))
})

router.get("/staff/office/:date", isAuthenticated, isAdmin, (req,res) =>{
  const shiftDate = req.params.date;
  const allStaff = []
  User.find({}).then(staff => {
    staff.forEach(doc => {
      if (doc.office) {
        const id = doc._id
        const firstName = doc.firstName;
        const lastName = doc.lastName;
        const unavail = [];
        doc.unavailability.forEach(unav => {
          if (unav){
          if (unav.date) {
            if (unav.date.toISOString() == shiftDate) {
              const unaId = unav._id
              const date = unav.date
              const allDay = unav.allDay
              const startTime = unav.startTime
              const endTime = unav.endTime
              const matchUnavail = {unaId, date, allDay, startTime, endTime}
              unavail.push(matchUnavail)
            }
           } else {null}
          } else {null}
        })
        allStaff.push({ id, firstName, lastName, unavail });
      } else {null }
    });
    res.send({ allStaff: allStaff });  
  })
  .catch(err => res.status(401).send(err))
})

router.get("/unavailibility", isAuthenticated, isAdmin, (req, res) => {
  const allUnavail = [];

  User.find({}).then(staff => {
    staff.forEach(doc => {
      const user = doc.firstName;
      const unavail = doc.unavailability;
      allUnavail.push({ user, unavail });
    });
    res.send({ allUnavailability: allUnavail });
  });
});

router.get("/unavailibility/:id", isAuthenticated, (req, res) => {
  const id = req.params.id;

  User.findOne(
    {
      _id: id
    },
    function(err, user) {
      res.send({ UserUnavailability: user.unavailability });
    }
  );
});

router.put("/unavailability/:id", isAuthenticated, (req, res) => {
  const _id = req.params.id;
  const { unavailability } = req.body;

  User.findOneAndUpdate(
    { _id },
    { $push: { unavailability } },
    {
      new: true,
      runValidators: true
    }
  ).then(doc => res.send(doc));
});

router.delete("/unavailability/:id/:unid", isAuthenticated, (req, res) => {
  const id = req.params.id;
  const unid = req.params.unid;

  User.findOne(
    {
      _id: id
    },
    function(err, user) {
      user.unavailability.forEach(un => {
        if (un._id == unid) {
          user.unavailability.remove(un);
          user.save();
        }
      });
      res.send(user);
    }
  );
});

router.get("/roster", isAuthenticated, (req, res) => {
  Roster.find({}).then(doc => {
    console.log(doc)
    return res.send(doc);
  });
});

router.get("/roster/:id/", isAuthenticated, (req, res) => {
  const { id } = req.params;
  Roster.findOne(
    {
      _id: id
    },
    function(err, roster) {
      res.send(roster);
    }
  );
});


router.post("/roster", isAuthenticated, isAdmin, (req, res) => {
  const { date, location, staff } = req.body;

  // back end recieves the name
  // compare to user database to get the id
  // send user id to roster db

  // const staffName = staff.staffMember

  // User.findOne({staffName})
  //   .then(doc => console.log(doc))

  const roster = new Roster({
    date,
    location,
    staff
  });

  // get the staffMember input and compare it to user model id

  roster
    .save()
    .then(doc => {
      console.log(doc.staff);
      res.send("roster has been created");
    })
    .catch(err => res.status(401).send(err));
});


// router.put('/roster/:id', isAuthenticated, isAdmin, (req, res) => {
//     const _id = req.params.id
//     const { date, location, staff } = req.body

//     Roster.findOneAndUpdate(
//         { _id },
//         { date, location, staff },
//         {
//             new: true,
//             runValidators: true
//         }
//     )
//     .then(doc => res.send(doc));

// })

router.put('/roster/:id', isAuthenticated, isAdmin,  (req, res) => {
  const _id = req.params.id
  const { staff } = req.body

  Roster.findOneAndUpdate(
      { _id },
      { $push: {staff} },
      {
          new: true,
          runValidators: true
      }
  )
  .then(doc => res.send(doc));

})

router.delete('/roster/:id/:sid', isAuthenticated, isAdmin,  (req, res) => {
  const id = req.params.id
  const sid = req.params.sid
  
  Roster.findOne({
    "_id": id
  }, function(err, roster) {
    roster.staff.forEach(st => {
      console.log(st)
      if(st._id == sid) {
        roster.staff.remove(st)
        roster.save()
      }
    })
    res.send(roster)
  })

  Roster.findOneAndUpdate(
    { _id },
    { date, location, staff },
    {
      new: true,
      runValidators: true
    }
  ).then(doc => res.send(doc));
});

router.get('/logout', async (req, res) => {
  await req.logout()
  req.session = null
  req.sessionOptions.maxAge = 0
  res.send('Successfully logged out');
  return res.redirect('/')
});

router.get("/me", (req, res) => {
  res.send(req.user);
});

module.exports = router;
