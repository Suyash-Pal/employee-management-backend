const Employee = require("../models/Employee.model");
const Attendance = require("../models/Attendance.model");
const Salary = require("../models/Salary.model");

// Helper: get number of days in month
const getDaysInMonth = (month) => {
  const [year, m] = month.split("-");
  return new Date(year, m, 0).getDate();
};

// Generate salary for all employees
exports.generateSalary = async (req, res) => {
  try {
    const { month } = req.body; // YYYY-MM

    const totalDays = getDaysInMonth(month);

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const employees = await Employee.find({ status: "ACTIVE" });

    for (let emp of employees) {
      const attendanceRecords = await Attendance.find({
        employeeId: emp._id,
        date: { $gte: startDate, $lt: endDate },
      });

      let presentDays = 0;
      let paidLeaves = 0;
      let unpaidLeaves = 0;

      attendanceRecords.forEach((record) => {
        if (record.status === "PRESENT") presentDays++;
        if (record.status === "PAID_LEAVE") paidLeaves++;
        if (
          record.status === "UNPAID_LEAVE" ||
          record.status === "ABSENT"
        )
          unpaidLeaves++;
      });

      const perDaySalary = emp.fixedMonthlySalary / totalDays;
      const finalSalary =
        emp.fixedMonthlySalary - unpaidLeaves * perDaySalary;

      await Salary.findOneAndUpdate(
        { employeeId: emp._id, month },
        {
          employeeId: emp._id,
          month,
          totalDays,
          presentDays,
          paidLeaves,
          unpaidLeaves,
          perDaySalary,
          finalSalary,
        },
        { upsert: true }
      );
    }

    res.json({ message: "Salary generated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get salaries for a month
exports.getSalariesByMonth = async (req, res) => {
  const { month } = req.query;

  const salaries = await Salary.find({ month }).populate(
    "employeeId",
    "name employeeCode fixedMonthlySalary"
  );

  res.json(salaries);
};
