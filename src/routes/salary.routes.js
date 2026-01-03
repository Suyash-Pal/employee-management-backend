const express = require("express");
const router = express.Router();

const {
  generateSalary,
  getSalariesByMonth,
} = require("../controllers/salary.controller");

router.post("/generate", generateSalary);
router.get("/", getSalariesByMonth);

module.exports = router;
