const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployees,
  deleteEmployee,
} = require("../controllers/employee.controller");

router.post("/", addEmployee);
router.get("/", getEmployees);
router.delete("/:id", deleteEmployee);

module.exports = router;
