const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
     required: true
  },
 email: {
    type: String,
    trim: true,
     required: true,
     unique: true
  },
  NIN: {
    type: String,
    trim: true,
    required: true
      },
userRole: {
    type: String,
     required: true,
     enum: ['attendant','manager', 'admin']
  },
});
registrationSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
module.exports = mongoose.model('Registration', registrationSchema);