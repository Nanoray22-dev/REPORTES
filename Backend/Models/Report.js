const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ["PENDING", "PROGRESS", "COMPLETED", "CLOSED", "REJECTED"],
    default: "PENDING",
  },
  image: {
    type: String,
    required: false,
  },
  incidentDate: {
    type: Date,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [commentSchema],
});


const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
module.exports = Report;
