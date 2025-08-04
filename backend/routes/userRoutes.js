const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// Public
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Authenticated
router.get("/profile", auth, userController.getProfile);
router.get("/notifications", auth, userController.getMyNotifications);

// Admin/Staff
router.post("/:userId/notify", auth, userController.sendNotification);

module.exports = router;
