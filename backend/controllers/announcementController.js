const Announcement = require('../models/Announcement');
const { handleServerError, sendError, sendSuccess } = require('../utils/http');

async function createAnnouncement(req, res) {
  const { title, content, targetRole = 'all' } = req.body;
  if (!title?.trim() || !content?.trim()) return sendError(res, 400, 'Add a title and message.');
  if (!['all', 'admin', 'hr', 'employee'].includes(targetRole)) return sendError(res, 400, 'Choose a valid audience.');
  try {
    const announcement = await Announcement.create({
      title: title.trim(), content: content.trim(), targetRole, postedBy: req.userId,
    });
    return sendSuccess(res, { statusCode: 201, data: announcement });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function getAllAnnouncements(req, res) {
  try {
    const announcements = await Announcement.find({ targetRole: { $in: ['all', req.role] } })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name loginId');
    return sendSuccess(res, { data: announcements });
  } catch (error) {
    return handleServerError(res, error);
  }
}

async function deleteAnnouncement(req, res) {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return sendError(res, 404, 'Announcement not found');
    return sendSuccess(res, { message: 'Announcement deleted' });
  } catch (error) {
    return handleServerError(res, error);
  }
}

module.exports = { createAnnouncement, getAllAnnouncements, deleteAnnouncement };
