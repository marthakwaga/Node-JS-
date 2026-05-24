const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const saleSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: String,
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    name: String,
    quantity: Number,
    unitPrice: Number,
    amount: Number
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'pending', 'partial'], 
    default: 'pending' 
  },
  amountPaid: { type: Number, default: 0 },
  transportCost: { type: Number, default: 0 },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);