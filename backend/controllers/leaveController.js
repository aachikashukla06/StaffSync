const Leave = require('../models/Leave');
const { handleServerError, sendError, sendSuccess } = require('../utils/http');

async function applyForLeave(req, res) {
  const { leaveType, startDate, endDate, reason } = req.body;
  if (!['sick', 'casual', 'paid'].includes(leaveType)) return sendError(res, 400, 'Choose a valid leave type.');
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return sendError(res, 400, 'Enter a valid leave date range.');
  }
  try {
    const leave = await Leave.create({ employeeId: req.userId, leaveType, startDate: start, endDate: end, reason });
    return sendSuccess(res, { statusCode: 201, data: leave });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getAllLeaves(req, res) {
  try {
    const leaves = await Leave.find()
      .populate('employeeId', 'name loginId email designation')
      .sort({ createdAt: -1 });
    return sendSuccess(res, { data: leaves });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getEmployeeLeaves(req, res) {
  try {
    const employeeId = req.params.id || req.userId;
    if (req.role === 'employee' && String(employeeId) !== String(req.userId)) {
      return sendError(res, 403, 'You can only view your own leave requests.');
    }
    const leaves = await Leave.find({ employeeId }).sort({ createdAt: -1 });
    return sendSuccess(res, { data: leaves });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function updateLeaveStatus(req, res) {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return sendError(res, 400, 'Choose approved or rejected.');
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!leave) return sendError(res, 404, 'Leave request not found.');
    return sendSuccess(res, { data: leave });
  } catch (error) {
    return handleServerError(res, error);
  }
}

module.exports = { applyForLeave, getAllLeaves, getEmployeeLeaves, updateLeaveStatus };
