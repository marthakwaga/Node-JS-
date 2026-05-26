const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.userrole === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Access denied. Admin only." });
};

// GET All Users (API)
router.get('/api', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// POST Register New User (Admin Only)
router.post('/user_reg', isAdmin, async (req, res) => {
  try { 
    const { fullname, username, password, userrole } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});
//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       fullname,
//       username,
//       password: hashedPassword,
//       userrole: userrole || 'sales'
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User created successfully", user: newUser });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error creating user" });
//   }
// });

// DELETE User (Admin Only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});
module.exports = router;