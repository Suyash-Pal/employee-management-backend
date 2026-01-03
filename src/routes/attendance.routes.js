const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance.model");

router.post("/", async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: "Date and records are required" });
    }

    for (let rec of records) {
      if (!rec.employeeId || !rec.status) {
        return res.status(400).json({ message: "Each record must have employeeId and status" });
      }
    }

    const attendance = await Attendance.findOneAndUpdate(
      { date },
      { date, records },
      { upsert: true, new: true }
    );

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/attendance/:date → Get attendance for a date
router.get("/:date", async (req, res) => {
  try {
    const requestedDate = req.params.date; // "2026-01-02"

    // Find attendance by exact string
    const attendance = await Attendance.findOne({ date: requestedDate });

    // If no document found, return empty records
    if (!attendance) {
      return res.status(200).json({ records: [] });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
