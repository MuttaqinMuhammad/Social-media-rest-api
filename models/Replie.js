const {
  Schema,
  model
} = require('mongoose')

const replySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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


}, {
  timeStamps: true
})

const Replies = new model('replie', replySchema)

module.exports = Replies