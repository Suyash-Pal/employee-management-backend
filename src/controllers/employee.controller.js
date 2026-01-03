const Employee = require("../models/Employee.model");

// Add new employee
exports.addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  const employees = await Employee.find({ status: "ACTIVE" });
  res.json(employees);
};

// Delete employee (soft delete)
exports.deleteEmployee = async (req, res) => {
  await Employee.findByIdAndUpdate(req.params.id, { status: "INACTIVE" });
  res.json({ message: "Employee deleted" });
};
