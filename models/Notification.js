const User = require('./User')
const Post = require('./post/Post')
const Comment = require('./post/Comment')
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
      enum: ['like', 'comment', 'reply', 'friendRequest', 'story', 'custom'],
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
/*
  if (this.event.toUpperCase() === 'COMMENT') {
    const post = await Post.findOne({ _id: this.source.sourceId })
    if (this.sender.toString() === post.user.toString()) {
      console.log('hit on the target')
      return
    }
  }*/
notificationSchema.pre('save', async function () {
  const user = await User.findOne({ _id: this.sender })
  switch (this.event.toUpperCase()) {
    case 'LIKE':
      this.text = `${user.name} liked your ${this.source.referance}`
      break
    case 'COMMENT':
      this.text = `${user.name} commented on your ${this.source.referance}`
      break
    case 'REPLY':
      this.text = `${user.name} replied to your ${this.source.referance}`
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
  notifyAllCommentators: async function (sender, sourceId) {
    const post = await Post.findOne({ _id: sourceId }).populate('comments')
    const user = await User.findOne({ id: sender })
    console.log(post.user)
    console.log(user)
    const commentators = post.comments.filter(
      (comments) => comments.user.toString() !== sender.toString(),
    ) //array
    if (commentators.length <= 0) {
      return
    }
    commentators.forEach(async (comments) => {
      const notifyAllCommentators = new this({
        sender: sender,
        reciever: comments.user,
        event: 'custom',
        text: `${user.name} also commented on ${
          user.gender === 'male' ? 'his' : 'her'
        } post`,
        source: {
          sourceId: sourceId,
          referance: 'post',
        },
      })
      await notifyAllCommentators.save()
    })
    return true
  },

  notifyOtherReplyUsers: async function (sender, sourceId) {
    const user = await User.findOne({ _id: sender })
    const comment = await Comment.findOne({ _id: sourceId }).populate(
      'user replies',
    )
    if (comment.replies.length <= 0) {
      return
    }
    const replies = comment.replies.filter(
      (replyObject) => replyObject.user !== sender && comment.user,
    )
    console.log(replies)
    replies.forEach((replyObject) => {
      const notifyAllReplyUser = new this({
        sender: sender,
        reciever: replyObject.user,
        event: 'custom',
        text: `${user.name} replied on ${comment.user.name}s comment`,
        source: {
          sourceId: sourceId,
          referance: 'comment',
        },
      })
    })

    return true
  },
}

const Notification = new model('Notification', notificationSchema)

module.exports = Notification
