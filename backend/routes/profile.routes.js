const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const profileController = require("../controllers/profile.controller");


// ===============================
// PROFILE ROUTES
// ===============================

// Get logged-in user's profile
router.get("/", auth, profileController.getProfile);

// Update user's profile
router.patch("/", auth, profileController.updateProfile);

// Delete user's account
router.delete("/", auth, profileController.deleteProfile);


module.exports = router;
