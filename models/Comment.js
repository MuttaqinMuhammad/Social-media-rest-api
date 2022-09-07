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
    required:true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true,
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true,
  }],
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required:true,
  }]


}, {
  timestamps: true
})


const Comment = new model('Comment', commentSchema)

module.exports = Comment