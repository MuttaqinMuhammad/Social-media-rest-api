const jwt = require('jsonwebtoken')
const sendMail = require('../helpers/sendMail')
const otpGenerator = require('../helpers/user/otpGenerator')
const config = require('config')
//models
const OTP = require('../models/OTP')
const User = require('../models/User')

const APP_NAME = config.get('APP_NAME')
const { JWT_SECRET_KEY } = config.get('JWT')

const sendOtp = async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (user) {
    await OTP.deleteOne({ user: user._id })
    const randomOTP = otpGenerator(6)
    const otp = new OTP({
      user: user._id,
      otp: randomOTP
    })
    try {
      await otp.save()
      const mailParam = {
        title: `your ${APP_NAME} OTP `,
        body: `Here is your OTP:${randomOTP} for the response your forget password request.
  please dont share this to anyone . this token will be expired in  munites.`,
        emailReciever: email
      }
      // const sendMailToUser = sendMail(mailParam)
      const userData = {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
      const payload = jwt.sign(userData, JWT_SECRET_KEY, {
        expiresIn: 1000 * 60 * 10
      })
      //redirect validate otp
      res
        .status(200)
        .cookie('validate-otp', payload, {
          httpOnly: true,
          signed: true,
          maxAge: 1000 * 60 * 60
        })
        .json({
          success: true,
          randomOTP, //must delete
          message: 'an otp has been sended to your email'
        })
    } catch (e) {
      next(e)
    }
  } else {
    res.status(500).json({
      success: false,
      message: 'no user found'
    })
  }
}

const validateOtp = async (req, res, next) => {
  const otp =
    typeof req.body.otp === 'string' && req.body.otp.length === 6
      ? req.body.otp
      : false
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : false
  const cookie = cookies['validate-otp'] ? cookies['validate-otp'] : false
  try {
    if (cookie && otp) {
      const decoded = jwt.verify(cookie, JWT_SECRET_KEY)
      const { userId, name, avatar, email } = decoded
      const dataOtp = await OTP.findOne({ user: userId })

      if (dataOtp.otp === otp) {
        await OTP.updateOne(
          { _id: dataOtp._id },
          {
            $set: {
              isValid: true
            }
          }
        )

        //redirect create a new password route
        return res.status(200).json({
          success: true
        })
      } else {
        throw new Error('invalid otp')
      }
    } else {
      throw new Error('access denied!')
    }
  } catch (e) {
    next(e)
  }
}

module.exports = {
  sendOtp,
  validateOtp
}
