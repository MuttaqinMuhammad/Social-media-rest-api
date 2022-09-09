// internal import
const User = require('../models/User')
const hashedPassword = require('../helpers/user/hashPassword')

//otp
const sendMail = require('../helpers/sendMail')
const otpGenerator = require('../helpers/user/otpGenerator')
const OTP = require('../models/OTP')

//external import
const jwt = require('jsonwebtoken')


const signup = async(req, res, next)=> {
	const {
		name,
		email,
		password,
		birthday,
		gender,
	} = req.body
	const user = new User({
		name,
		email,
		password: hashedPassword(password),
		birthday,
		gender,
	})

	try {
		const newUser = await user.save()
		res.status(200).json({
			success: true,
			newUser,
		})
	} catch (e) {

		next(e)
	}


}

const login = async (req, res, next)=> {
	try {
		
	const {
		email,
		password
	} = req.body

	const user = await User.findOne({
		email
	}).select('+password')

	if (user._id) {
		const verify = user.password === hashedPassword(password);
		if (verify) {
			const token = jwt.sign({
				userId: user._id
			}, process.env.JWT_SECRET_KEY, {
				expiresIn: process.env.JWT_EXPIRY_TIME
			})
			
			res.cookie(process.env.COOKIE_NAME, token, {
				httpOnly: true,
				signed: true,
				maxAge: 86400000,
			})
			res.status(200).json({
				success: true,
				user,
				token,
			}) 

		}
	}


	} catch (e) {
		next(e)
	}
}

const logout = async (req, res, next)=>{
  res.clearCookie(process.env.COOKIE_NAME);
	res.status(200).json({
	success:true,
	message:"log out successful!",
	})
}


//experiment
const sendOtp = async (req, res, next)=>{
  const {email} = req.body
const user = await User.findOne({_id:email})

if(user){
  const randomOTP = otpGenerator(6)
  const otp = new OTP({
    email,
    otp:randomOTP,
  }) 
  try {
    await otp.save()
  const sendMailToUser = sendMail(`your ${process.env.APP_NAME} OTP `,`Here is your OTP:${randomOTP} for the response your forget password request.
  please dont share this to anyone . this token will be expired in  munites.`,email)  

  } catch (e) {
    next(e)
  }

}else{
  res.status(500).json({
    success:false,
    message:"no user found",
  })
}

res.status(200).json({
  success:true,
  message:"an otp has been sended to your email"
})
  

}



module.exports = {
	signup,
	login,
	logout,
}
