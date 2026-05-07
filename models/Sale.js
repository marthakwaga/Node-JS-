const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const saleSchema = new mongoose.Schema({
  saleDate: {
    type: Date,
    default: Date.now

  },
 representative: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Registration',
    trim: true,
     required: true,
  },
productCode: {
    type: String,
  },
phoneNumber: {
    type: Number,

  },
productSelect: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Stock',   
    required: true
      },
qty: {
    type: Number,
    trim: true,
    required: true
      },
unitPrice: {
    type: Number,
    required: true
      },
totalPrice: {
    type: Number,
    required: true
      },  
});
// saleSchema.plugin(passportLocalMongoose,{
//   usernameField: 'email'
module.exports = mongoose.model('Sale', saleSchema);