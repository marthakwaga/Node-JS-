const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const CreditSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
    trim: true
  }, 
  creditAmount: {
    type: Number,
    required: true,
    min: 0
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  // Better structure for items
  itemsSupplied: {
    type: [itemSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Cleared', 'Overdue'],
    default: 'Pending'
  },
  notes: String,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate balance and status
CreditSchema.pre('save', function() {
  // Calculate balance
  this.balance = this.creditAmount - this.amountPaid;

  // Auto-update status
  if (this.balance <= 0) {
    this.status = 'Cleared';
  } else if (this.balance < this.creditAmount) {
    this.status = 'Partially Paid';
  } else if (this.dueDate < new Date() && this.balance > 0) {
    this.status = 'Overdue';
  } else {
    this.status = 'Pending';
  }

});

module.exports = mongoose.model('Credit', CreditSchema);