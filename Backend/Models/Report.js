const mongoose = require("mongoose");
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
    enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"],
    default: "PENDING",
  },
  image:{
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
    default: null
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

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
