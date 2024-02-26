const ENUM = require("../helper/enum");
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: [ENUM.Type.PENDING, ENUM.Type.COMPLETED],
    default: ENUM.Type.PENDING,
  },
  dueDate: {
    type: Date,
  },
  category: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
