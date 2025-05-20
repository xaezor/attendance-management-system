// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: { // e.g., roll number or a unique ID
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  // You can add more fields like class, section, contact details, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Student', StudentSchema);
