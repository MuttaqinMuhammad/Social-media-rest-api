const {
  Schema,
  model
} = require('mongoose')
const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  caption: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    public_id: String,
    url: String,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required:true,
  }],
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
}, {
  timestamps: true
})


const Post = new model('Post', postSchema)

module.exports = Post