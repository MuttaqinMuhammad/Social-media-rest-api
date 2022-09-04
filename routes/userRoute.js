const router = require('express').Router()
//middlewares
const auth = require('../middlewares/common/auth')
const validationResult = require('../middlewares/common/validationResult')

// validators
const signupvalidator = require('../validators/user/signup')
const loginvalidator = require('../validators/user/login')

const {
signup,	
login,
logout,
} = require('../controllers/user')


router.get('/login', (req, res, next) => {
  res.render('loginm')
})
router.post('/signup', signupvalidator, validationResult, signup)
router.post('/login',loginvalidator, validationResult, login)
router.delete('/logout',auth, logout)



module.exports = router 
