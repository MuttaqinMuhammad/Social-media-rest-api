const Notification = require('../models/Notification')

const showNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ reciever: req.user._id })
    if (notifications.length === 0) throw new Error('No notifications!')
    res.status(200).json({
      success: true,
      notifications,
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  showNotifications,
}
