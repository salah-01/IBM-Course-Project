const express = require("express");
const router = express.Router();
const userController = require('../controllers/usercontroller');

// Get all users
router.get("/", userController.getAllUsers);
// Get a specific user
router.get("/:username", userController.getASpecificUser);

module.exports = router;