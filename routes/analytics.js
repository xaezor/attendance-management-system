// routes/analytics.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// @route   GET api/analytics/summary-cards
// @desc    Get data for summary cards (total students, total attendance taken)
// @access  Private
router.get('/summary-cards', protect, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    // Count distinct attendance sessions taken by the logged-in user
    const totalAttendanceTaken = await Attendance.countDocuments({ takenBy: req.user.id });
    // If you want to count distinct days attendance was taken:
    // const distinctAttendanceDays = await Attendance.distinct('date', { takenBy: req.user.id });
    // const totalAttendanceTaken = distinctAttendanceDays.length;


    res.json({
      totalStudents,
      totalAttendanceTaken,
      // viewLogs will redirect to attendance page on frontend, so no specific data needed here
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analytics/attendance-over-time
// @desc    Get data for % of present students vs date graph
// @access  Private
router.get('/attendance-over-time', protect, async (req, res) => {
  try {
    // Get attendance logs taken by the current user
    const attendanceLogs = await Attendance.find({ takenBy: req.user.id }).sort({ date: 1 });

    if (!attendanceLogs || attendanceLogs.length === 0) {
        return res.json([]); // Return empty if no data
    }

    const graphData = attendanceLogs.map(log => {
      const totalRecords = log.records.length;
      if (totalRecords === 0) {
        return { date: log.date.toISOString().split('T')[0], percentagePresent: 0 };
      }
      const presentStudents = log.records.filter(r => r.status === 'present').length;
      const percentagePresent = (presentStudents / totalRecords) * 100;
      return {
        date: log.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        percentagePresent: parseFloat(percentagePresent.toFixed(2)), // Round to 2 decimal places
      };
    });

    res.json(graphData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/analytics/student-presence-ranking
// @desc    Get most present and most absent students (top 5 each)
// @access  Private
router.get('/student-presence-ranking', protect, async (req, res) => {
    try {
        // This is a more complex query. We need to aggregate attendance data per student.
        // We'll only consider attendance sessions taken by the logged-in user.

        const studentStats = await Attendance.aggregate([
            // Match attendance logs taken by the current user
            { $match: { takenBy: new mongoose.Types.ObjectId(req.user.id) } },
            // Unwind the records array to process each student's record individually
            { $unwind: '$records' },
            // Group by student to calculate their presence/absence
            {
                $group: {
                    _id: '$records.student', // Group by student's ObjectId
                    presentCount: {
                        $sum: { $cond: [{ $eq: ['$records.status', 'present'] }, 1, 0] },
                    },
                    absentCount: {
                        $sum: { $cond: [{ $eq: ['$records.status', 'absent'] }, 1, 0] },
                    },
                    onLeaveCount: {
                        $sum: { $cond: [{ $eq: ['$records.status', 'onleave'] }, 1, 0] },
                    },
                    totalRecords: { $sum: 1 }, // Total times this student's attendance was marked
                },
            },
            // Lookup student details (name, studentId)
            {
                $lookup: {
                    from: 'students', // Name of the students collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'studentInfo',
                },
            },
            // Deconstruct the studentInfo array (it will have one element)
            { $unwind: '$studentInfo' },
            // Project the fields we need
            {
                $project: {
                    _id: 0, // Exclude the default _id from group stage
                    studentId: '$studentInfo.studentId',
                    name: '$studentInfo.name',
                    presentCount: 1,
                    absentCount: 1,
                    onLeaveCount: 1,
                    totalRecords: 1,
                    // Calculate presence percentage for sorting, handle division by zero
                    presencePercentage: {
                        $cond: [
                            { $eq: ['$totalRecords', 0] },
                            0,
                            { $divide: ['$presentCount', '$totalRecords'] }
                        ]
                    },
                     absencePercentage: { // For sorting by most absent
                        $cond: [
                            { $eq: ['$totalRecords', 0] },
                            0,
                            { $divide: ['$absentCount', '$totalRecords'] }
                        ]
                    }
                },
            },
        ]);

        // Sort for most present (descending by presencePercentage, then by presentCount)
        const mostPresent = [...studentStats] // Create a copy for sorting
            .sort((a, b) => {
                if (b.presencePercentage === a.presencePercentage) {
                    return b.presentCount - a.presentCount; // Secondary sort by raw present count
                }
                return b.presencePercentage - a.presencePercentage;
            })
            .slice(0, 5); // Get top 5

        // Sort for most absent (descending by absencePercentage, then by absentCount)
        const mostAbsent = [...studentStats] // Create another copy
            .sort((a, b) => {
                 if (b.absencePercentage === a.absencePercentage) {
                    return b.absentCount - a.absentCount; // Secondary sort by raw absent count
                }
                return b.absencePercentage - a.absencePercentage;
            })
            .slice(0, 5); // Get top 5

        res.json({ mostPresent, mostAbsent });

    } catch (err) {
        console.error('Error in student-presence-ranking:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
