// internal import
const User = require('../models/User')
const hashedPassword = require('../helpers/hashPassword')

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
	console.log(req.body)
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
		console.log(e)
		next(e)
	}


}

const login = async (req, res, next)=> {
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

}

const logout = async (req, res, next)=>{
  res.clearCookie(process.env.COOKIE_NAME);
	res.status(200).json({
	success:true,
	message:"log out successful!",
	})
}





module.exports = {
	signup,
	login,
	logout,
}