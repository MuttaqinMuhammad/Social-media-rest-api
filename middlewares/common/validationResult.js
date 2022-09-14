/*
Description: This function is used to handle express-validator errors.
*/

const {validationResult} = require('express-validator')


module.exports = (req, res, next)=>{
	const error = validationResult(req)
if (Object.keys(error.mapped()).length > 0) {
	console.log(error.mapped())

return res.status(500).json({...error.mapped(),success:false})

}
	next()
}