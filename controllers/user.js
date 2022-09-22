// internal import
const User = require('../models/User')
const OTP = require('../models/OTP')
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { JWT_SECRET_KEY, JWT_EXPIRY_TIME } = config.get('JWT')
const AUTH_COOKIE_NAME = config.get('AUTH_COOKIE_NAME')

const signup = async (req, res, next) => {
  const { name, email, password, birthday, gender } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log(hashedPassword)
  const user = new User({
    name,
    email,
    password: hashedPassword,
    birthday,
    gender
  })

  try {
    const newUser = await user.save()
    res.status(200).json({
      success: true,
      newUser
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      email
    }).select('+password')
    if (user._id) {
      const verify = await bcrypt.compare(password, user.password)
      if (verify) {
        const token = jwt.sign(
          {
            userId: user._id
          },
          JWT_SECRET_KEY,
          {
            expiresIn: JWT_EXPIRY_TIME
          }
        )

        res.cookie(AUTH_COOKIE_NAME, token, {
          httpOnly: true,
          signed: true,
          maxAge: 86400000
        })
        res.status(200).json({
          success: true,
          user,
          token
        })
      } else {
        throw new Error('Access denied!')
      }
    }
  } catch (e) {
    next('Access denied')
  }
}

const logout = async (req, res, next) => {
  res.clearCookie(AUTH_COOKIE_NAME)
  res.status(200).json({
    success: true,
    message: 'log out successful!'
  })
}

const changePasswordWithOtp = async (req, res, next) => {
  const { password } = req.body

  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : false
  const cookie = cookies['validate-otp'] ? cookies['validate-otp'] : false
  try {
    if (cookie) {
      const { userId } = jwt.verify(cookie, JWT_SECRET_KEY)
      const otp = await OTP.findOne({ user: userId })
      console.log(otp)
      if (otp.isValid) {
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              password: hashedPassword(password)
            }
          }
        )
        res.status(200).clearCookie('validate-otp').json({
          success: true
        })
      } else {
        throw new Error('authentication failure')
      }
    } else {
      throw new Error('authentication failure')
    }
  } catch (e) {
    next(e)
  }
}

const deleteAccount = async (req,res,next)=>{
  
}


module.exports = {
  signup,
  login,
  logout,
  changePasswordWithOtp
}
