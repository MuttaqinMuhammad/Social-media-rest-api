/*
Description: This function is used to check if the user is logged in. finds a single cookie from user browser and verify the json web token. 
*/

const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')

const COOKIE_NAME = config.get('AUTH_COOKIE_NAME')
const { JWT_SECRET_KEY } = config.get('JWT')

const auth = async (req, res, next) => {
  //checking if user have cookies .if user dont have any cookie returns false
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : false

  if (cookies) {
    const token = cookies[COOKIE_NAME] //// indexing the cookie
    const tokenData = jwt.verify(token, JWT_SECRET_KEY) //verifing the cookie
    try {
      /*
binding data which i have decoded from cookie to req.user
*/
      req.user = await User.findOne({ _id: tokenData.userId })
      next()
    } catch (e) {
      next(e)
    }
  } else {
    res.status(500).json({
      success: false,
      message: 'please login first'
    })
  }
}

module.exports = auth
