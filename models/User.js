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
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: String,
  avatar: String,
  unavailability: {  
    date: Date,
    allDay: Boolean,
    startTime: Date,
    endTime: Date,
    comment: String,
    approved: Boolean
  },
isDeleted: {
    type: Boolean,
    default: false
  }
});

// const userSchema = new Schema({
//     email: String,
//     password: String
// })

module.exports = mongoose.model('User', userSchema)