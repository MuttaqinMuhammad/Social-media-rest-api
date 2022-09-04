const {check} = require('express-validator')


module.exports = [
	check('caption')
	.not().isEmpty().withMessage('post caption is required')
	.isLength({max:250}).withMessage('caption can not be more than 250 charactes'),
	check('body')
	.not().isEmpty().withMessage('post body is required')
	.isLength({max:6000}).withMessage('post can not be more than 6000 charactes'),
	]





