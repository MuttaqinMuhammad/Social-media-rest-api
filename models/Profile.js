const {
  Schema,
  model
} = require('mongoose')


const profileSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    public_id: String,
    url: String,
  },

  nickname: String,
  bio: {
    type: String,
  },
  address: {
    country: String,
    city: String,
    zipcode: String,
    homeAddress: String,
  },
  occupation: String,
  worksAt: String,
  joined: {
    type: Date,
    default: Date.now,
    },
    hobby: {
      type: Array,
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:true,
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:true,
    }],
    posts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required:true
    }],
    bookmarks: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }]

  },
  {
    timestamps: true
  })

  const Profile = new model('Profile', profileSchema)

  module.exports = Profile