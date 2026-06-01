const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  userrole: {
    type: String,
    enum: ['sales', 'manager', 'admin'],
    default: 'sales'
  }
}, { timestamps: true });

// passport-local-mongoose handles username, password, hashing automatically
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);