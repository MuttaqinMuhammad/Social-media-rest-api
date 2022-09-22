const Comment = require('./Comment')
const Reply = require('./Replie')

const { Schema, model } = require('mongoose')
const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    caption: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      public_id: String,
      url: String
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
      }
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
)

postSchema.statics = {
  removeChilds: async function (post) {
    const comments =
      post.comments && post.comments.length > 0 ? post.comments : null
    if (comments) {
      comments.forEach(async (commentId) => {
        const singleComment = await Comment.findOne({
          _id: commentId
        })

        const replies =
          singleComment.replies && singleComment.replies.length > 0
            ? singleComment.replies
            : null

        if (replies) {
          await Reply.deleteMany({ _id: { $in: replies } })
        }

        await Comment.deleteOne({
          _id: commentId
        })
      })
    }
  }
}
const Post = new model('Post', postSchema)

module.exports = Post
