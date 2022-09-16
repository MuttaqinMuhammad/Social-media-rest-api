const { Schema, model } = require('mongoose')

const otpSchema = new Schema(
  {
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Otp = new model('otp', otpSchema)

module.exports = Otp
