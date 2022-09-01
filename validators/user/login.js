const { check } = require('express-validator')


module.exports = [
check('email')	
	.not().isEmpty().withMessage("email can't be empty"),
	check('password')
.not().isEmpty().withMessage("password can't be empty"),
	
]