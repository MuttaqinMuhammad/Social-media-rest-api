const Notification = require('../../models/Notification')
const Profile = require('../../models/Profile')

module.exports = (story) =>
  new Promise(async (resolve, reject) => {
    try {
      const { name, user, friends } = await Profile.findOne({
        user: story.creator
      })
      if (friends.length <= 0) resolve(true)
      friends.forEach(async (userId) => {
        const notification = await Notification.create({
          sender: user,
          reciever: userId,
          event: 'story',
          source: {
            sourceId: story._id,
            referance: 'Storie'
          }
        })
      })
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })
