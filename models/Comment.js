const {
  Schema,
  model
} = require('mongoose')

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]


}, {
  timestamps: true
})


const Comment = new model('Comment', commentSchema)

module.exports = Comment