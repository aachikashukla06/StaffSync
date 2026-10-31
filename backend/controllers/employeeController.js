const Employee = require('../models/Employee');
const User = require('../models/User');
const Department = require('../models/Department');
const { findConflictingUser, getIsActiveFromStatus, sanitizeUser, updateManagedUser } = require('../utils/userAccounts');
const { handleServerError, sendError, sendSuccess } = require('../utils/http');

function splitName(value = '') {
  const [firstName = '', ...rest] = value.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

async function getAllEmployees(req, res) {
  try {
    const users = await User.find({ role: 'employee' }).sort({ createdAt: -1 });
    const employeeDocs = await Employee.find({ User: { $in: users.map((user) => user._id) } })
      .populate('Department', 'name');
    const profilesByUser = new Map(employeeDocs.map((profile) => [String(profile.User), profile]));

    const data = users.map((user) => {
      const profile = profilesByUser.get(String(user._id));
      const nameParts = splitName(user.name || '');
      return {
        _id: profile?._id || user._id,
        userId: user._id,
        firstName: profile?.firstName || nameParts.firstName || user.loginId,
        lastName: profile?.lastName || nameParts.lastName || '',
        name: user.name || user.loginId,
        loginId: user.loginId,
        email: user.email || '',
        designation: profile?.designation || user.designation || user.profileRole || '',
        salary: profile?.salary || 0,
        Department: profile?.Department || null,
        isActive: user.isActive,
        joinDate: user.joinDate || user.createdAt,
        hasProfile: Boolean(profile),
      };
    });

    return sendSuccess(res, { data });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function createEmployeeProfile(req, res) {
  const { userId, firstName, lastName, designation, salary, department } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'employee') return sendError(res, 404, 'Employee account not found');
    if (await Employee.findOne({ User: userId })) return sendError(res, 409, 'Employee profile already exists');
    const profile = await Employee.create({
      User: userId, firstName: firstName?.trim(), lastName: lastName?.trim(),
      Department: department || undefined, designation: designation?.trim(), salary: Number(salary) || undefined,
    });
    return sendSuccess(res, { statusCode: 201, data: profile });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getMyEmployeeProfile(req, res) {
  try {
    const profile = await Employee.findOne({ User: req.userId })
      .populate('User', 'name loginId email role designation profileRole joinDate isActive')
      .populate('Department', 'name description');
    if (!profile) return sendError(res, 404, 'Employee profile not found. Ask HR to complete your profile.');
    return sendSuccess(res, { data: profile });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getEmployeeById(req, res) {
  try {
    const profile = await Employee.findById(req.params.id)
      .populate('User', 'name loginId email role designation profileRole joinDate isActive')
      .populate('Department', 'name description');
    if (!profile) return sendError(res, 404, 'Employee profile not found');
    if (req.role === 'employee' && String(profile.User?._id) !== String(req.userId)) {
      return sendError(res, 403, 'You can only view your own employee profile');
    }
    return sendSuccess(res, { data: profile });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function updateEmployee(req, res) {
  const { name, loginId, email, designation, salary, department, status, password } = req.body;
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'employee' });
    if (!user) return sendError(res, 404, 'Employee account not found');

    const conflictingUser = await findConflictingUser({
      loginId: loginId || user.loginId,
      email: email === '' ? undefined : email || user.email,
      excludeUserId: user._id,
    });
    if (conflictingUser) return sendError(res, 409, 'Employee ID or email is already in use');

    const profileRole = designation || user.profileRole || 'Team Member';
    await updateManagedUser(user, {
      name: name ?? user.name,
      loginId: loginId ?? user.loginId,
      email: email ?? user.email,
      designation: designation ?? user.designation,
      profileRole,
      isActive: getIsActiveFromStatus(status, undefined),
      password,
      joinDate: req.body.joinDate,
    });

    let employee = await Employee.findOne({ User: user._id });
    const names = splitName(name ?? user.name);
    if (!employee) employee = new Employee({ User: user._id });
    employee.firstName = names.firstName || user.loginId;
    employee.lastName = names.lastName;
    employee.designation = designation ?? employee.designation ?? user.designation;
    if (salary !== undefined && salary !== '') employee.salary = Number(salary);
    if (department !== undefined) employee.Department = department || undefined;
    await employee.save();

    const updatedUser = await User.findById(user._id);
    return sendSuccess(res, {
      message: 'Employee profile updated',
      data: { ...sanitizeUser(updatedUser), employeeProfileId: employee._id, Department: employee.Department },
    });
  } catch (error) {
    return handleServerError(res, error);
  }
}

module.exports = { getAllEmployees, createEmployeeProfile, getMyEmployeeProfile, getEmployeeById, updateEmployee };
