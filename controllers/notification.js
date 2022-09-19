const Notification = require('../models/Notification')

const showNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ reciever: req.user._id })
    if (notifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No notifications!',
      })
    }
    res.status(200).json({
      success: true,
      notifications,
    })
  } catch (e) {
    next(e)
  }
}

const viewPostByNotification = async (req, res, next) => {}
const viewCommentsByNotification = async (req, res, next) => {}

module.exports = {
  showNotifications,
}
