// routes/attendance.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student'); // To validate student IDs

// @route   POST api/attendance
// @desc    Create a new attendance log
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('date', 'Date is required').isISO8601().toDate(), // Validates date format
      check('records', 'Attendance records are required').isArray({ min: 1 }),
      check('records.*.student', 'Student ID is required for each record').not().isEmpty(),
      check('records.*.status', 'Status is required for each record').isIn(['present', 'absent', 'onleave']),
      // Optional: Add checks for className, subject if you use them
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, records, className, subject } = req.body;

    try {
      // Optional: Validate that all student IDs in records exist in the Student collection
      for (const record of records) {
        const studentExists = await Student.findById(record.student);
        if (!studentExists) {
          return res.status(400).json({ msg: `Student with ID ${record.student} not found.` });
        }
      }

      // Optional: Check if attendance for this date (and class/subject) already exists
      // const existingAttendance = await Attendance.findOne({ date, className, subject, takenBy: req.user.id });
      // if (existingAttendance) {
      //   return res.status(400).json({ msg: 'Attendance for this date (and class/subject) has already been taken by you.' });
      // }


      const newAttendance = new Attendance({
        date,
        takenBy: req.user.id, // Logged-in user
        records,
        className, // Optional
        subject,   // Optional
      });

      const attendance = await newAttendance.save();
      res.status(201).json(attendance);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/attendance
// @desc    Get all attendance logs (can be paginated or filtered)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // You might want to add pagination and filtering (e.g., by date range, class)
    // Populate 'takenBy' with username and 'records.student' with student name/ID
    const attendanceLogs = await Attendance.find({ takenBy: req.user.id }) // Show logs taken by the logged-in user
      .populate('takenBy', 'username') // Populate user who took attendance
      .populate('records.student', 'name studentId') // Populate student details in records
      .sort({ date: -1 }); // Sort by most recent date

    res.json(attendanceLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/:id
// @desc    Get a specific attendance log by its ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const attendanceLog = await Attendance.findById(req.params.id)
      .populate('takenBy', 'username')
      .populate('records.student', 'name studentId');

    if (!attendanceLog) {
      return res.status(404).json({ msg: 'Attendance log not found' });
    }

    // Optional: Check if the log belongs to the user or if the user is an admin
    if (attendanceLog.takenBy._id.toString() !== req.user.id) {
        // return res.status(401).json({ msg: 'User not authorized to view this log' });
        // Depending on your rules, you might allow viewing if not taken by them.
    }

    res.json(attendanceLog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Attendance log not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/attendance/:id
// @desc    Update an existing attendance log
// @access  Private
router.put(
  '/:id',
  [
    protect,
    [
      // Add validation checks similar to POST route if needed
      check('date', 'Date is required').optional().isISO8601().toDate(),
      check('records', 'Attendance records are required').optional().isArray({ min: 1 }),
      check('records.*.student', 'Student ID is required for each record').optional().not().isEmpty(),
      check('records.*.status', 'Status is required for each record').optional().isIn(['present', 'absent', 'onleave']),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, records, className, subject } = req.body;

    try {
      let attendanceLog = await Attendance.findById(req.params.id);
      if (!attendanceLog) {
        return res.status(404).json({ msg: 'Attendance log not found' });
      }

      // Check if the logged-in user is the one who took this attendance
      if (attendanceLog.takenBy.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized to update this log' });
      }

      // Optional: Validate student IDs if records are being updated
      if (records) {
        for (const record of records) {
          if (record.student) { // Ensure student field exists before trying to find
            const studentExists = await Student.findById(record.student);
            if (!studentExists) {
              return res.status(400).json({ msg: `Student with ID ${record.student} not found.` });
            }
          } else {
            return res.status(400).json({ msg: `Student ID missing in one of the records.` });
          }
        }
      }


      // Build update object
      const updateFields = {};
      if (date) updateFields.date = date;
      if (records) updateFields.records = records;
      if (className !== undefined) updateFields.className = className; // Allow setting to empty string
      if (subject !== undefined) updateFields.subject = subject;     // Allow setting to empty string


      attendanceLog = await Attendance.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      ).populate('takenBy', 'username').populate('records.student', 'name studentId');

      res.json(attendanceLog);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Attendance log not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);


// @route   DELETE api/attendance/:id
// @desc    Delete an attendance log
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const attendanceLog = await Attendance.findById(req.params.id);

        if (!attendanceLog) {
            return res.status(404).json({ msg: 'Attendance log not found' });
        }

        // Check if the logged-in user is the one who took this attendance
        if (attendanceLog.takenBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this log' });
        }

        await Attendance.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Attendance log removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Attendance log not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
