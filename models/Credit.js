const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const creditSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now

  },
 salesperson: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Registration',
    trim: true,
     required: true,
  },
name: {
    type: String,
  },
phoneNumber: {
    type: Number,

  },
item: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Stock',   
    required: true
      },
quantity: {
    type: Number,
    trim: true,
    required: true
      },
unitprice: {
    type: Number,
    required: true
      },
});
creditSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
module.exports = mongoose.model('Credit', creditSchema);