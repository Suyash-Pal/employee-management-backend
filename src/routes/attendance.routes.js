const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance.model");

router.post("/", async (req, res) => {
  try {
    const { date, records } = req.body;

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

module.exports = router;
