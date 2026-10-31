const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { handleServerError, sendError, sendSuccess } = require('../utils/http');

function validAmount(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}

async function createPayroll(req, res) {
  const { employeeId, month, year, basicPay, hra = 0, deductions = 0 } = req.body;
  if (!employeeId) return sendError(res, 400, 'Select an employee.');
  if (!Number.isInteger(Number(month)) || Number(month) < 1 || Number(month) > 12) return sendError(res, 400, 'Month must be between 1 and 12.');
  if (!Number.isInteger(Number(year)) || Number(year) < 2000) return sendError(res, 400, 'Enter a valid payroll year.');
  if (![basicPay, hra, deductions].every(validAmount)) return sendError(res, 400, 'Payroll amounts must be zero or greater.');
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return sendError(res, 404, 'Employee profile not found.');
    const exists = await Payroll.findOne({ employeeId, month: Number(month), year: Number(year) });
    if (exists) return sendError(res, 409, 'Payroll already exists for this employee and month.');
    const payroll = await Payroll.create({
      employeeId, month: Number(month), year: Number(year), basicPay: Number(basicPay),
      hra: Number(hra), deductions: Number(deductions),
      netSalary: Number(basicPay) + Number(hra) - Number(deductions),
    });
    return sendSuccess(res, { statusCode: 201, data: payroll });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getAllPayroll(req, res) {
  try {
    const payrolls = await Payroll.find()
      .sort({ year: -1, month: -1, createdAt: -1 })
      .populate({ path: 'employeeId', select: 'firstName lastName designation User', populate: { path: 'User', select: 'name loginId email' } });
    return sendSuccess(res, { data: payrolls });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getEmployeePayrollHistory(req, res) {
  try {
    let employeeId = req.params.id;
    if (!employeeId) {
      const employee = await Employee.findOne({ User: req.userId });
      if (!employee) return sendError(res, 404, 'Employee profile not found.');
      employeeId = employee._id;
    }
    const payrolls = await Payroll.find({ employeeId }).sort({ year: -1, month: -1 });
    return sendSuccess(res, { data: payrolls });
  } catch (error) {
    return handleServerError(res, error);
  }
}

module.exports = { createPayroll, getAllPayroll, getEmployeePayrollHistory };
