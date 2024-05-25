const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { getReports, createReport, addCommentToReport, updateReportState } = require("../Controller/reportController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", authenticateJWT, getReports);
router.post("/", authenticateJWT, upload.single("image"), createReport);
router.post("/comment", authenticateJWT, addCommentToReport);
router.put("/state", authenticateJWT, updateReportState);

module.exports = router;
