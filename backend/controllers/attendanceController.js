const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { handleServerError, sendError, sendSuccess } = require('../utils/http');

async function getOwnProfile(userId) {
  return Employee.findOne({ User: userId });
}

function todayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

async function checkIn(req, res) {
  try {
    const employee = await getOwnProfile(req.userId);
    if (!employee) return sendError(res, 404, 'Complete your employee profile before recording attendance.');
    const date = todayStart();
    const existing = await Attendance.findOne({ employeeId: employee._id, date });
    if (existing) return sendError(res, 409, 'You have already checked in today.');
    const attendance = await Attendance.create({ employeeId: employee._id, date, checkIn: new Date() });
    return sendSuccess(res, { statusCode: 201, data: attendance });
  } catch (error) {
    if (error.code === 11000) return sendError(res, 409, 'You have already checked in today.');
    return handleServerError(res, error);
  }
}

async function checkOut(req, res) {
  try {
    const employee = await getOwnProfile(req.userId);
    if (!employee) return sendError(res, 404, 'Complete your employee profile before recording attendance.');
    const attendance = await Attendance.findOne({ employeeId: employee._id, date: todayStart() });
    if (!attendance) return sendError(res, 404, 'Check in before checking out.');
    if (attendance.checkOut) return sendError(res, 409, 'You have already checked out today.');
    attendance.checkOut = new Date();
    attendance.workingHours = Number(((attendance.checkOut - attendance.checkIn) / 3600000).toFixed(2));
    await attendance.save();
    return sendSuccess(res, { data: attendance });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getMyAttendance(req, res) {
  try {
    const employee = await getOwnProfile(req.userId);
    if (!employee) return sendError(res, 404, 'Employee profile not found');
    const records = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });
    return sendSuccess(res, { data: records });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getAllAttendance(req, res) {
  try {
    const records = await Attendance.find()
      .sort({ date: -1 })
      .populate({ path: 'employeeId', select: 'firstName lastName designation', populate: { path: 'User', select: 'name loginId email' } });
    return sendSuccess(res, { data: records });
  } catch (error) {
    return handleServerError(res, error);
  }
}

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance };
