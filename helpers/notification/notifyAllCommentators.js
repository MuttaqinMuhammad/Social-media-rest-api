const User = require('../../models/User')
const Notification = require('../../models/Notification')
const Post = require('../../models/post/Post')

/*
Description: this function notifies all the commentators except the post author. thst "the author also commented on his post"
*/

const notifyAllCommentators = async (sender, source) =>
  new Promise((resolve, reject) => {
    const post = source
    const user = sender

    const commentators = post.comments.filter(
      (comments, index, array) =>
        comments.user.toString() !== sender._id.toString() &&
        array.findIndex(
          (data) => data.user.toString() === comments.user.toString()
        ) === index
    ) //array
    if (commentators.length <= 0) {
      resolve(true)
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
            referance: 'Post'
          }
        })
      })
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })

module.exports = notifyAllCommentators
