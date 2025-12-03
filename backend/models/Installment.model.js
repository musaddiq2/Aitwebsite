import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  receiptNo: {
    type: String,
    required: [true, 'Receipt number is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNo: {
    type: String,
    trim: true
  },
  paidAmount: {
    type: Number,
    required: [true, 'Paid amount is required'],
    min: 0
  },
  paidDate: {
    type: Date,
    required: [true, 'Paid date is required'],
    default: Date.now
  },
  amountInWords: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  balanceFees: {
    type: Number,
    required: true,
    min: 0
  },
  totalFees: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Online', 'Cheque', 'UPI', 'Card', 'Other'],
    required: [true, 'Payment mode is required']
  },
  transactionId: {
    type: String,
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  chequeNumber: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

installmentSchema.index({ studentId: 1 });
// receiptNo already has unique: true which creates an index
installmentSchema.index({ paidDate: 1 });

export default mongoose.model('Installment', installmentSchema);

