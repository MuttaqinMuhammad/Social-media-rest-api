const Comment = require('../../models/post/Comment')
const User = require('../../models/User')
const Notification = require('../../models/Notification')

/*
Description: this function notifies the comment repliers. 
*/

module.exports = async (sender, source) =>
  new Promise((resolve, reject) => {
    const user = sender
    const comment = source
    if (comment.replies.length <= 0) {
      resolve(true)
    }

    const replies = comment.replies.filter(
      (replyObject, index, arr) =>
        replyObject.user.toString() !== sender._id.toString() &&
        arr.findIndex(
          (repObj) => repObj.user.toString() === replyObject.user.toString()
        ) === index
    )

    try {
      replies.forEach(async (replyObject) => {
        await Notification.create({
          sender: sender._id,
          reciever: replyObject.user,
          event: 'custom',
          text: `${user.name} replied to ${
            user._id.toString() === comment.user._id.toString()
              ? 'his'
              : `${comment.user.name}'\s`
          } comment`,
          source: {
            sourceId: source._id,
            referance: 'Comment'
          }
        })
      })
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })
