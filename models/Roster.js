// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const rosterSchema = new Schema({
//   startDate: Date,
//   endDate: Date,
//   location: String,
//   shifts:[
//     {
//     day: String,
//     staff: 
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         startTime: Date,
//         endTime: Date
//       }
//     }
//   ]
// });

// module.exports = Roster = mongoose.model('Roster', rosterSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rosterSchema = new Schema({
  date: Date,
  location: String,
  staff: [
    {
      type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        startTime: Date,
        endTime: Date
    }
  ]
});

module.exports = Roster = mongoose.model('Roster', rosterSchema);