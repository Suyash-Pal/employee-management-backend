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
