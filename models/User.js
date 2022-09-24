const crypto = require('crypto')
const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    provider: {
      name: String,
      id: String,
      verified: Boolean
    },
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    avatar: {
      public_id: String,
      url: String
    },

    password: {
      type: String,
      select: false,
      trim: true
    },
    birthday: {
      type: String
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'custom'],
      default: 'male',
      required: true
    },

    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    }
  },
  {
    timestamps: true
  }
)

const User = new model('User', userSchema)

module.exports = User
