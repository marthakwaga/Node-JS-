const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const supplierSchema = new mongoose.Schema({
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
pdtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Stock',   
    required: true
      },
quantity: {
    type: Number,
    trim: true,
    required: true
      },
pdtId: {
    type: String,
    trim: true,
    required: true
      },
});
supplierSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
module.exports = mongoose.model('Supplier', supplierSchema);