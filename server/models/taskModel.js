const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    taskDesc: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    taskDeadline: {
      type: Date,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

module.exports = Task;
