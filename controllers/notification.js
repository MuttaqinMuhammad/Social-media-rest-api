const Notification = require('../models/Notification')
const getSourceFromNotification = require('../helpers/notification/getSourceFromNotification')

const showNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      reciever: req.user._id
    }).populate('sourceId')
    if (notifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No notifications!'
      })
    }
    res.status(200).json({
      success: true,
      notifications
    })
  } catch (e) {
    next(e)
  }
}

const viewSource = async (req, res, next) => {
  const { notificationId } = req.params
  const supportedReferances = ['Post', 'Comment', 'Replie']
  try {
    const notification = await Notification.findOne({ _id: notificationId })

    if (supportedReferances.includes(notification.source.referance)) {
      const source = await getSourceFromNotification(notification)
      return res.status(200).json({
        success: true,
        source
      })
    }
  } catch (e) {
    next(e)
  }
}

module.exports = {
  showNotifications,
  viewSource
}
