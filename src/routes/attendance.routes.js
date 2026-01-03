const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendanceByMonth,
} = require("../controllers/attendance.controller");

router.post("/", markAttendance);
router.get("/", getAttendanceByMonth);

module.exports = router;
