const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const DepositSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  depositAmount: {
    type: Number,
    required: true,
    min: 10000
  },
  periodMonths: {
    type: Number,
    enum: [3, 6, 12],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Redeemed', 'Expired'],
    default: 'Active'
  },
  amountRedeemed: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingAmount: {
    type: Number,
    default: function() { return this.depositAmount; },
    min: 0
  },
  representative: {
    type: String,        
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Pre-save middleware to calculate endDate and remainingAmount
DepositSchema.pre('save', function() {
  if (this.isNew) {
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + this.periodMonths);
    this.endDate = endDate;
    this.remainingAmount = this.depositAmount;
  }

});

module.exports = mongoose.model('Deposit', DepositSchema);