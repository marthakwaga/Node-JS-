const express = require("express");
const router = express.Router();
const passport = require("passport");
const Registration = require("../models/Registration");

// Register user page — load existing users too
router.get("/user_reg", async (req, res) => {
  try {
    const users = await Registration.find()
      .select('-hash -salt')
      .sort({ createdAt: -1 })
      .lean();
    res.render("userreg", { users });
  } catch (err) {
    console.error(err);
    res.render("userreg", { users: [], error: "Failed to load users" });
  }
});

router.post("/user_reg", async (req, res) => {
  try {
    const { fullName, email, password, userRole, phoneNumber, NIN } = req.body;

    const existingUser = await Registration.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const users = await Registration.find().select('-hash -salt').sort({ createdAt: -1 }).lean();
      return res.render("userreg", { users, error: "Email is already registered" });
    }

    const newUser = new Registration({
      fullName,
      email: email.toLowerCase(),
      userRole,
      phoneNumber,
      NIN: NIN.toUpperCase()
    });

    await Registration.register(newUser, password, async (err) => {
      if (err) {
        const users = await Registration.find().select('-hash -salt').sort({ createdAt: -1 }).lean();
        return res.render("userreg", { users, error: err.message });
      }
      res.redirect("/user_reg");  // ← redirect back to same page so new user appears
    });

  } catch (error) {
    console.error(error);
    const users = await Registration.find().select('-hash -salt').sort({ createdAt: -1 }).lean();
    res.render("userreg", { users, error: error.message });
  }
});

// Login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  if (req.user.userRole === 'admin') {
    res.redirect('/admin_dash');
  } else if (req.user.userRole === 'attendant') {
    res.redirect('/sales_dash');
  } else if (req.user.userRole === 'manager') {
    res.redirect('/manager_dash');
  } else {
    res.redirect('/');
  }
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash('success_msg', 'Logged out successfully');
    res.redirect('/');
  });
});

// Forgot Password
// GET forgot password page
router.get('/forgotPassword', (req, res) => {
  res.render('forgot-password', { error: null, success: null });
});

// POST — reset password
router.post('/forgotPassword', async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Find user by email
    const user = await Registration.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render('forgot-password', {
        error: 'No account found with that email address'
      });
    }

    // Double check passwords match (backend validation)
    if (newPassword !== confirmPassword) {
      return res.render('forgot-password', {
        error: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.render('forgot-password', {
        error: 'Password must be at least 6 characters'
      });
    }

    // passport-local-mongoose setPassword method handles hashing
    await user.setPassword(newPassword);
    await user.save();

    res.render('forgot-password', {
      success: 'Password reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.render('forgot-password', {
      error: 'Something went wrong. Please try again.'
    });
  }
});

module.exports = router;