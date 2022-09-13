const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const auth = async (req, res, next)=>{
const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : false
 
if(cookies){
	const token = cookies[process.env.COOKIE_NAME]	
const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY)  
try {
	req.user = await User.findOne({_id:tokenData.userId})
next()
} catch (e) {
	next(e)
}
}else{
	res.status(500).json({
	  success:false,
		message:"please login first"
	})

}

	
	
}

module.exports = auth