const multer = require('multer')
// const path = require('path')

const supportedFormats = [
"image/jpeg",
	"image/jpg",
	"image/png",
	]
module.exports = multer({
	storage:multer.diskStorage({}),
	
fileFilter: (req, file, callback)=> {
	console.log(file)
		if (supportedFormats.includes(file.mimetype)) {
			callback(null, true)
		} else {
			callback( new Error('only .png , .jpg , .jpeg format allowed'))
		}
	}
	
	
	
})