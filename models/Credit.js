const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const creditSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now

  },
  supplierName: {
    type: String,
    trim: true,
    required: true
  },
 phoneNumber: {
    type: Number,
    trim: true,
    required: true  
  },
 creditAmount: {
    type: Number,
    trim: true,
    required: true
      },
 dueDate: {
    type: Date,
    required: true
  },
 itemsSupplied: {
    type: Number,
    required: true
      },
});
creditSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
module.exports = mongoose.model('Credit', creditSchema);