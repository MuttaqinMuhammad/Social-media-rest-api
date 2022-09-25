const multer = require('multer')

const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png']
module.exports = multer({
  storage: multer.diskStorage({}),

  fileFilter: (req, file, callback) => {
    if (supportedFormats.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new Error('only .png , .jpg , .jpeg format allowed'))
    }
  }
})
