const User = require('../../models/User')
const Notification = require('../../models/Notification')
const Post = require('../../models/post/Post')

const notifyAllCommentators = async (sender, source) =>
  new Promise((resolve, reject) => {
    const post = source
    const user = sender

    const commentators = post.comments.filter(
      (comments, index, array) =>
        comments.user.toString() !== sender._id.toString() &&
        array.findIndex(
          (data) => data.user.toString() === comments.user.toString(),
        ) === index,
    ) //array
    if (commentators.length <= 0) {
      return
    }

    try {
      commentators.forEach(async (comments) => {
        await Notification.create({
          sender: user._id,
          reciever: comments.user,
          event: 'custom',
          text: `${user.name} also commented on ${
            user.gender === 'male' ? 'his' : 'her'
          } post`,
          source: {
            sourceId: source._id,
            referance: 'post',
          },
        })
      })
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })

module.exports = notifyAllCommentators
