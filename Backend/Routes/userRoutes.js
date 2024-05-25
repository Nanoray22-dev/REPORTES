const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { getAllUsers, getUserProfile } = require("../Controller/userController");

const router = express.Router();

router.get("/", authenticateJWT, getAllUsers);
router.get("/profile", authenticateJWT, getUserProfile);

module.exports = router;
