const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  admin:{
    type: Boolean,
    default: false
  },
  store:{
    type: Boolean,
    default: false
  }, 
  office:{
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: String,
  avatar: String,
  unavailability: [{  
    date: Date,
    allDay: Boolean,
    startTime: String,
    endTime: String,
    comment: String,
    approved: {
      type: Boolean,
      default: false
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

// const userSchema = new Schema({
//     email: String,
//     password: String
// })

module.exports = mongoose.model('User', userSchema)