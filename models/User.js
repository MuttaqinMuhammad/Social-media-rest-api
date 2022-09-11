const crypto = require('crypto')
const {
  Schema,
  model
} = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    public_id: String,
    url: String,
  },


  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
  },
  salt:{
    type:String,
    required:true,
  },
  birthday: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'custom'],
    default: 'male',
      required: true,
    },

    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    }


  }, {
    timestamps: true
  })



// UserSchema.methods.validPassword = function(password) { 
//     const hash = crypto.pbkdf2Sync(password,  
//     this.salt, 1000, 64, `sha512`).toString(`hex`); 
//     return this.hash === hash; 
// }; 

  const User = new model('User', userSchema)

  module.exports = User