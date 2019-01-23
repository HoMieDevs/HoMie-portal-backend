// // const express = require('express');
// // const router = express.Router();
// // const jwt = require('jsonwebtoken');
// // const bcrypt = require('bcryptjs');
// // const saltRounds = 10;

// // const User = require('../models/User')

// // const generateToken = (user) => {
// //     const token = jwt.sign(
// //         { email: user.email },
// //         'secretkey',
// //         { expiresIn: '1h'}
// //     )
// //     return token;
// // }

// // // router.post('/', (req, res) => {
// // //     const { email, password } = req.body
// // //     if (email) {
// // //         console.log(email)
// // //         User.findOne({ email })
// // //         .then(doc => {
// // //             console.log(doc)
// // //             if (!doc) {
// // //             return res.status(403).send('Bad credentials1');
// // //             }
// // //             const salt = bcrypt.genSaltSync(saltRounds)
// // //             const hash = bcrypt.hashSync(password, salt)
// // //             // if (!bcrypt.compareSync(password, hash)) {
// // //             //     console.log(password)
// // //             //     console.log(doc.password)
// // //             //     return res.send('credentials correct')
// // //             // }
// // //             const result = bcrypt.compare(password, hash, function(err, res) {
// // //                 res.send("password correct");
// // //             })
// // //             if(result) {
// // //                 console.log("cool")
// // //             }
            
// // //             const token = generateToken(doc);
// // //             return res.send({token});
// // //         });
// // //     } else {
// // //         return res.status(403).send('Bad credentials3');
// // //     }
// // // })

// // // router.post('/', (req, res) => {

// // //     const email = req.body.email;
// // //     const password = req.body.password;
  
// // //     // Find user by email
// // //     User.findOne({ email }).then(user => {
// // //       // Check for user
// // //       if (!user) {
// // //         return res.status(404);
// // //       }
  
// // //       // Check Password
// // //       bcrypt.compare(password, user.password).then(isMatch => {
// // //         if (isMatch) {
// // //           // User Matched
// // //           const payload = { email: user.email }; // Create JWT Payload
  
// // //           // Sign Token
// // //           jwt.sign(
// // //             payload,
// // //             keys.secretOrKey,
// // //             { expiresIn: 3600 },
// // //             (err, token) => {
// // //               res.json({
// // //                 success: true,
// // //                 token: 'Bearer ' + token
// // //               });
// // //             }
// // //           );
// // //         } else {
// // //           return res.status(400);
// // //         }
// // //       });
// // //     });
// // //   });

// // module.exports = router

// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const User = require('../models/User')
// const bcrypt = require('bcryptjs');

// const saltRounds = 10; // bcrypt salting

// const generateToken = (user) => {
//     const token = jwt.sign(
//         {email: user.email},
//         'coder-academy',
//         { expiresIn: '1h' }
//     );
//     return token;
// }

// router.post('/', (req, res, next) => {
//         const {email, password} = req.body;
//         if (email && password){
//             User.findOne({email})
//             .then(doc => {
//                 if(doc){
//                     bcrypt.compare( password, doc.password, function(err, resp) {
//                         if(resp) {
//                             const token = generateToken(doc);
//                             console.log('password match')
//                             return res.send({token});
//                             // Passwords match
//                         } else {
//                             // Passwords don't match
//                             console.log('password not match')
//                          return res.status(403).send('BAD CREDENTIALS')
//                         } 
//                       });
                
//                 } else {
                
//                     return res.status(403).send({msg:'BAD CREDENTIALS'});
//                 }
//             });
//         }    
// })

// router.post('/register', (req, res, next) => {
//     const { email, password } = req.headers;
    
//     if (email) {
//         User.findOne({ email })
//             .then(doc => {
//                 if (doc) {
//                     return res.status(400).send('User already exists');
//                 } else {
//                     bcrypt.hash(password, saltRounds, function(err, hash) {
//                         // Store hash in your password DB.
//                         const newUser = new User({ email, password: hash });
//                         newUser.save(function (err, newUser) {
//                 if (err) {
//                     return res.status(500).send('unable to save user');
//                 }
//                             const token = generateToken(newUser)
//                             return res.send({ token })
                        
//                       });
//                     })
//                 }

//             })
//     }
// })


// module.exports = router;

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
        // if (doc.password !== password) {
        //   return res.status(403).send('Bad credentials');
        // }
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