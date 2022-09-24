const router = require('express').Router()

const auth = require('../middlewares/common/auth')
const validationResult = require('../middlewares/common/validationResult')
const profileValidator = require('../validators/profile/profileValidator')
const upload = require('../helpers/photoUploader')

const {
  getMyProfile,
  getUserProfile,
  createProfile,
  editProfile
} = require('../controllers/profile')

router.get('/:userId', auth, getUserProfile)
router.get('/', auth, getMyProfile)
router.post(
  '/create',
  auth,
  upload.single('avatar'),
  profileValidator,
  validationResult,
  createProfile
)
router.post(
  '/edit',
  auth,
  upload.single('avatar'),
  profileValidator,
  validationResult,
  editProfile
)

module.exports = router
