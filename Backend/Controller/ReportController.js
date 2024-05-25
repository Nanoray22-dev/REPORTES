const Report = require("../models/Report");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { notifyAllClients } = require("../socket");

const baseUrl = process.env.BASE_URL;

const getReports = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let reports;
    if (user.role === "admin") {
      reports = await Report.find().populate("createdBy", "username").populate("comments.createdBy", "username");
    } else {
      reports = await Report.find({ createdBy: userId }).populate("createdBy", "username").populate("comments.createdBy", "username");
    }

    const reportsWithDetails = reports.map(report => ({
      ...report.toObject(),
      createdBy: report.createdBy.username,
      image: report.image ? `${baseUrl}${report.image}` : null,
    }));

    res.json(reportsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching reports" });
  }
};

const createReport = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { title, description, incidentDate } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newReport = new Report({
      title,
      description,
      state: "PENDING",
      image,
      incidentDate,
      createdBy: userId,
    });

    await newReport.save();

    const populatedReport = await Report.findById(newReport._id).populate("createdBy", "username");

    const reportWithDetails = {
      ...populatedReport.toObject(),
      createdBy: populatedReport.createdBy.username,
      image: populatedReport.image ? `${baseUrl}${populatedReport.image}` : null,
    };

    notifyAllClients("new-report", reportWithDetails);
    res.status(201).json(reportWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating report" });
  }
};

const addCommentToReport = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { reportId, comment } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    report.comments.push({ text: comment, createdBy: userId });
    await report.save();

    const populatedReport = await Report.findById(report._id).populate("createdBy", "username").populate("comments.createdBy", "username");

    const reportWithDetails = {
      ...populatedReport.toObject(),
      createdBy: populatedReport.createdBy.username,
      image: populatedReport.image ? `${baseUrl}${populatedReport.image}` : null,
    };

    notifyAllClients("new-comment", reportWithDetails);
    res.status(201).json(reportWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding comment to report" });
  }
};

const updateReportState = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { reportId, newState } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (report.createdBy.toString() !== userId && decodedToken.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    report.state = newState;
    await report.save();

    const populatedReport = await Report.findById(report._id).populate("createdBy", "username").populate("comments.createdBy", "username");

    const reportWithDetails = {
      ...populatedReport.toObject(),
      createdBy: populatedReport.createdBy.username,
      image: populatedReport.image ? `${baseUrl}${populatedReport.image}` : null,
    };

    notifyAllClients("report-updated", reportWithDetails);
    res.status(201).json(reportWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating report state" });
  }
};

module.exports = { getReports, createReport, addCommentToReport, updateReportState };
