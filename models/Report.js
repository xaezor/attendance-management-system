// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming the logged-in user reports the issue
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the report'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the issue'],
  },
  category: { // Optional: to categorize issues
    type: String,
    enum: ['bug', 'feature_request', 'ui_issue', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);
