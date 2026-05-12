const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
productType: {
    type: String,
  },
quantity: {
    type: Number,

  },
unitOfMeasure: {
    type: String,   
    required: true
      },
supplierName: {
    type: String,
    required: true
      },
phoneNumber: {
    type: Number,   
    required: true
      },
email: {
    type: String,
      },
costPrice: {
    type: Number,   
    required: true
},
sellingPrice: {
    type: Number,
    required: true,
      },
comment: {
    type: String,
    trim: true,
      },
 dateRecieved: {
    type: Date,
    default: Date.now
  },
 itemImage: {
    type: String,
    default: null
  },
 Total: {
    type: Number,
    min: 0
  },
});

module.exports = mongoose.model('Stock', stockSchema);