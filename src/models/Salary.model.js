const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    totalDays: Number,
    presentDays: Number,
    paidLeaves: Number,
    unpaidLeaves: Number,
    perDaySalary: Number,
    finalSalary: Number,
  },
  { timestamps: true }
);

salarySchema.index({ employeeId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Salary", salarySchema);
