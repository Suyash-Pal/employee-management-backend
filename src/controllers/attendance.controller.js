const Attendance = require("../models/Attendance.model");

// Mark or update attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    await Attendance.findOneAndUpdate(
      { employeeId, date },
      { employeeId, date, status },
      { upsert: true }
    );

    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get attendance for a month
exports.getAttendanceByMonth = async (req, res) => {
  const { month } = req.query; // YYYY-MM

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const attendance = await Attendance.find({
    date: { $gte: startDate, $lt: endDate },
  }).populate("employeeId", "name employeeCode");

  res.json(attendance);
};

exports.getMonthlyAttendanceSummary = async (req, res) => {
  try {
    const { employeeId, month } = req.params;
    // month = "2026-01"

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const records = await Attendance.find({
  employeeId,
  date: {
    $regex: `^${month}-`
  }
});

    let presentDays = 0;
    let paidLeaves = 0;
    let unpaidLeaves = 0;

    records.forEach((r) => {
      if (r.status === "PRESENT") presentDays++;
      if (r.status === "PAID_LEAVE") paidLeaves++;
      if (r.status === "UNPAID_LEAVE") unpaidLeaves++;
    });

    res.json({
      presentDays,
      paidLeaves,
      unpaidLeaves
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
