const { Schema, model } = require('mongoose')

const replySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    commentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Comment'
    },

    body: {
      type: String,
      required: true,
      trim: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timeStamps: true
  }
)

const Reply = new model('Replie', replySchema)

module.exports = Reply
