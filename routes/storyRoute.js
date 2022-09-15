const router = require('express').Router()
const {
getStories  
  
} = require('../controllers/story')
const cloudinary = require('../helpers/photoUploader')

//middlewares
const auth = require('../middlewares/common/auth')


router.get('/',auth, getStories)
// router.get('/:storyId', )
// router.post('/', createStory)
// router.delete('/', deleteStory)


module.exports = router