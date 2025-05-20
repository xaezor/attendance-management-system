// routes/students.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance'); // To fetch attendance data for a student

// @route   POST api/students
// @desc    Add a new student
// @access  Private (requires login)
router.post(
  '/',
  [
    protect, // Middleware to protect the route
    [
      check('studentId', 'Student ID is required').not().isEmpty(),
      check('name', 'Name is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, name, studentClass, section } = req.body; // Add other fields as needed

    try {
      let student = await Student.findOne({ studentId });
      if (student) {
        return res.status(400).json({ errors: [{ msg: 'Student with this ID already exists' }] });
      }

      student = new Student({
        studentId,
        name,
        // studentClass,
        // section,
      });

      await student.save();
      res.status(201).json(student);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/students
// @desc    Get all students
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }); // Sort by name
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id
// @desc    Get a single student by their MongoDB ID and their attendance summary
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Fetch attendance records for this student
    const attendanceRecords = await Attendance.find({ 'records.student': student._id });

    let presentCount = 0;
    let absentCount = 0;
    let onLeaveCount = 0;
    let totalEvents = attendanceRecords.length; // Or more accurately, count distinct attendance sessions

    attendanceRecords.forEach(session => {
        const record = session.records.find(r => r.student.toString() === student._id.toString());
        if (record) {
            if (record.status === 'present') presentCount++;
            else if (record.status === 'absent') absentCount++;
            else if (record.status === 'onleave') onLeaveCount++;
        }
    });


    res.json({
      student,
      attendanceSummary: {
        totalEvents: attendanceRecords.length, // Number of times attendance was taken where this student was included
        present: presentCount,
        absent: absentCount,
        onLeave: onLeaveCount,
      },
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Student not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/students/:id
// @desc    Update a student
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { studentId, name } = req.body;
    const studentFields = {};
    if (studentId) studentFields.studentId = studentId;
    if (name) studentFields.name = name;
    // Add other fields as needed

    try {
        let student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        // Check if new studentId is already taken by another student
        if (studentId && studentId !== student.studentId) {
            const existingStudent = await Student.findOne({ studentId });
            if (existingStudent) {
                return res.status(400).json({ msg: 'Another student with this ID already exists' });
            }
        }

        student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: studentFields },
            { new: true } // Returns the updated document
        );
        res.json(student);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/students/:id
// @desc    Delete a student (and potentially their attendance records or anonymize them)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        // Option 1: Delete the student
        await Student.findByIdAndDelete(req.params.id);

        // Option 2: Also delete related attendance records (use with caution)
        // await Attendance.updateMany(
        //     { 'records.student': req.params.id },
        //     { $pull: { records: { student: req.params.id } } }
        // );
        // await Attendance.deleteMany({ 'records.student': req.params.id, records: { $size: 0 } }); // Clean up empty attendance docs

        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
