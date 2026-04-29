const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
 email: {
    type: String,
    trim: true,
     required: true,
     unique: true
  },
role: {
    type: String,
     required: true
  },
phoneNumber: {
    type: Number,
     required: true
  },
NIN: {
    type: String,
    trim: true,
    required: true
      },
});
registrationSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
module.exports = mongoose.model('Registration', registrationSchema);