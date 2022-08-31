const router = require('express').Router()
//middlewares
const auth = require('../middlewares/common/auth')
const validationResult = require('../middlewares/common/validationResult')

// validators
const signupvalidator = require('../validators/user/signup')

const {
signup,	
login,
logout,
} = require('../controllers/user')

router.post('/signup', signupvalidator, validationResult, signup)
router.post('/login', login)
router.delete('/logout',auth, logout)

module.exports = router 