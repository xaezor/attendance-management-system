// models/Attendance.js
const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'onleave'], // Possible attendance statuses
    required: true,
  },
  // No need for studentId here as we are referencing the Student object
});

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    // default: Date.now, // Consider if you want to default to now or set explicitly
  },
  takenBy: { // The user who took the attendance
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  className: { // Optional: if you have multiple classes/sections
    type: String,
  },
  subject: { // Optional: if attendance is subject-specific
    type: String,
  },
  records: [AttendanceRecordSchema], // Array of attendance records for each student
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure that for a given date, className, and subject (if used), an attendance log is unique.
// This might be too restrictive if you allow multiple attendance sessions per day for the same class.
// Consider your exact needs for uniqueness.
// AttendanceSchema.index({ date: 1, className: 1, subject: 1 }, { unique: true });


module.exports = mongoose.model('Attendance', AttendanceSchema);
