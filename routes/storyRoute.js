const router = require('express').Router()
const {
  getStories,
  getSingleStory,
  createStory,
  deleteStory
} = require('../controllers/story')
const upload = require('../helpers/photoUploader')

//middlewares
const auth = require('../middlewares/common/auth')

router.get('/', auth, getStories)
router.get('/:storyId', auth, getSingleStory)
router.post('/', auth, upload.single('story'), createStory)
router.delete('/:storyId', auth, deleteStory)

module.exports = router
