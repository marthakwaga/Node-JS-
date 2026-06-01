const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration'); // ← use Registration not User

const isAdmin = (req, res, next) => {
  if (req.user && req.user.userRole === 'admin') return next();
  res.status(403).json({ message: "Access denied. Admin only." });
};

// GET all users — API for the frontend table
router.get('/api', async (req, res) => {
  try {
    const users = await Registration.find()
      .select('-hash -salt -password')
      .sort({ createdAt: -1 })
      .lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// DELETE user (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;