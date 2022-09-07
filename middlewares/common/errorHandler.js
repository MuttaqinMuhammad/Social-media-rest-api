const colors = require('colors/safe')


const errorHandler = (err, req, res, next)=>{
	if(res.headerSent){
		console.log(colors.bold.rainbow('headers already sent!'))
		return next(err)
	}
	if(err.status === 404){
		return res.status(404).json({
			success:false,
			error:'404 not found!'
		})
	}
	
	console.log(colors.bold.brightRed(err))
	res.status(500).json({
		success:false,
   error:err.message
	})
}

const notFound = (req, res, next)=>{
	const error = new Error('404 not found')
	error.status = 404
	next(error)
}

module.exports = [
notFound,
errorHandler,
]