const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
 productCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Registration',
    trim: true,
     required: true,
  },

productType: {
    type: String,
  },
quantity: {
    type: Number,

  },
unitofmeasure: {
    type: Number,   
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
    required: true
      },
costPrice: {
    type: Number,   
    required: true
},
tpCost: {
    type: Number,   
    required: true
      },

sellingprice: {
    type: Number,
    required: true,
    validate:{
        validator:function(value){
            return value >this.costprice;
        },
        message: 'Selling price must be greater than cost price'
    }
      },
comment: {
    type: String,
    trim: true,
      },
 dateRecieved: {
    type: Date,
    default: Date.now

  },
 itemimage: {
    type: String,
    default: null
  },
});
stockSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
module.exports = mongoose.model('Stock', stockSchema);