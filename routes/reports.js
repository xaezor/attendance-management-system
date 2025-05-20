// routes/reports.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const Report = require('../models/Report');

// @route   POST api/reports
// @desc    Submit a new issue report
// @access  Private (requires login)
router.post(
  '/',
  [
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is optional but must be one of the allowed values if provided')
        .optional()
        .isIn(['bug', 'feature_request', 'ui_issue', 'other']),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category } = req.body;

    try {
      const newReport = new Report({
        reportedBy: req.user.id, // Logged-in user
        title,
        description,
        category, // Will default if not provided
      });

      const report = await newReport.save();
      res.status(201).json(report);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/reports
// @desc    Get all reports (potentially for an admin view, or user's own reports)
// @access  Private (can be restricted further, e.g., admin only)
router.get('/', protect, async (req, res) => {
    try {
        // Example: Get reports submitted by the logged-in user
        // For an admin, you might want to fetch all reports: await Report.find().populate('reportedBy', 'username');
        const reports = await Report.find({ reportedBy: req.user.id })
            .populate('reportedBy', 'username') // Show username of who reported
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/:id
// @desc    Get a specific report by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('reportedBy', 'username');

        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }

        // Optional: Check if the user is authorized to view this report (e.g., it's their own or they are admin)
        // if (report.reportedBy._id.toString() !== req.user.id /* && !req.user.isAdmin (add isAdmin to User model if needed) */) {
        //     return res.status(401).json({ msg: 'Not authorized to view this report' });
        // }

        res.json(report);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Report not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/reports/:id
// @desc    Update a report (e.g., by an admin to change status)
// @access  Private (likely admin-only)
router.put(
  '/:id',
  [
    protect,
    // Add admin check middleware here if this is admin-only
    [
      check('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']),
      // Add other fields an admin might update
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, status } = req.body;

    try {
      let report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ msg: 'Report not found' });
      }

      // Authorization: Ensure only admin or perhaps the original reporter (for certain fields) can update.
      // For simplicity, this example doesn't implement strict role-based update logic.
      // if (report.reportedBy.toString() !== req.user.id && !req.user.isAdmin) {
      //    return res.status(401).json({ msg: 'Not authorized to update this report' });
      // }

      const updateFields = {};
      if (title) updateFields.title = title; // Reporter might be allowed to update title
      if (description) updateFields.description = description; // Reporter might be allowed to update description
      if (category) updateFields.category = category; // Reporter might be allowed to update category
      if (status) updateFields.status = status; // Usually updated by admin


      report = await Report.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      ).populate('reportedBy', 'username');

      res.json(report);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


module.exports = router;
