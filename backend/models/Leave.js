const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  leaveType: { type: String, enum: ['sick', 'casual', 'paid'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reason: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
