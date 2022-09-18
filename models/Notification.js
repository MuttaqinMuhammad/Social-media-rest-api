const User = require('./User')
const Post = require('./post/Post')
const { Schema, model } = require('mongoose')

const notificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: String,
      enum: ['like', 'comment', 'reply', 'friendRequest', 'story'],
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    source: {
      sourceId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      referance: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
)

notificationSchema.pre('save', async function () {
  if (this.event.toUpperCase() === 'COMMENT') {
    const post = await Post.findOne({ _id: this.source.sourceId })
    if (this.sender.toString() === post.user.toString()) {
      console.log('hit on the target')
      return
    }
  }
  const user = await User.findOne({ _id: this.sender })
  switch (this.event.toUpperCase()) {
    case 'LIKE':
      this.text = `${user.name} liked your ${this.source.referance}`
      break
    case 'COMMENT':
      this.text = `${user.name} commented on your ${this.source.referance}`
      break
    case 'REPLY':
      this.text = `${user.name} ${this.source.referance} your comment`
      break
    case 'ADDFRIEND':
      this.text = `${user.name} send you a ${this.source.referance} request`
      break
    case 'STORY':
      this.text = `${user.name} uploaded a ${this.source.referance}`
      break
  }
})

notificationSchema.statics = {
  notifyAll: async function (sender, sourceId) {
    const post = await Post.findOne({ _id: sourceId }).populate('comments')
    const user = await User.findOne({ id: sender })

    const commentators = post.comments.filter(
      (comments) => comments.user.toString() !== sender.toString(),
    ) //array

    commentators.forEach(async (comments) => {
      const notifyAllCommentators = new this({
        sender: sender,
        reciever: comments.user,
        event: 'comment',
        text: `${user.name} also commented ${
          user.gender === 'male' ? 'his' : 'her'
        } post`,
        source: {
          sourceId: sourceId,
          referance: 'post',
        },
      })
      await notifyAllCommentators.save()
      console.log(notifyAllCommentators)
    })
    return true
  },
}
const Notification = new model('Notification', notificationSchema)

module.exports = Notification
