const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance.model");
const Employee = require("../models/Employee.model");

router.get("/calculate", async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: "employeeId, month, year required" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const daysInMonth = 30;
    const perDaySalary = employee.fixedMonthlySalary / daysInMonth;

    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const attendances = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
      "records.employeeId": employeeId,
    });

    let payableDays = 0;

    attendances.forEach((att) => {
      const record = att.records.find(
        (r) => r.employeeId.toString() === employeeId
      );

      if (record && (record.status === "PRESENT" || record.status === "PAID_LEAVE")) {
        payableDays += 1;
      }
    });

    const finalSalary = payableDays * perDaySalary;

    res.json({
      employeeId,
      name: employee.name,
      fixedMonthlySalary: employee.fixedMonthlySalary,
      payableDays,
      finalSalary,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
