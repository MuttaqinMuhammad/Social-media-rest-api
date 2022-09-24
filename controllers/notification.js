const Notification = require('../models/Notification')
const Profile = require('../models/Profile')
const getSourceFromNotification = require('../helpers/notification/getSourceFromNotification')

const showNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      reciever: req.user._id
    })
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

  try {
    const notification = await Notification.findOne({ _id: notificationId })

    if (['Post', 'Comment', 'Replie'].includes(notification.source.referance)) {
      const source = await getSourceFromNotification(notification)
      return res.status(200).json({
        success: true,
        source
      })
    }
    if(notification.source.referance.toUpperCase()==="PROFILE"){
const profile = await Profile.findOne({_id:notification.source.sourceId}).populate('followers friends following posts')
return res.status(200).json({
  success:true,
  profile,
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
