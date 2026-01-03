const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employeeCode: {
      type: String,
      required: true,
      unique: true,
    },
    fixedMonthlySalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
