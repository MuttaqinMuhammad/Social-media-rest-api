const router = require('express').Router()

const auth = require('../middlewares/common/auth')
const validationResult = require('../middlewares/common/validationResult')
const profileValidator = require('../validators/profile/profileValidator')
const upload = require('../helpers/photoUploader')

const {
  getMyProfile,
  getUserProfile,
  createProfile,
  editProfile,
  followAndUnfollow,
  FriendList,
  friendRequests,
  addFriend,
  unfriend,
  acceptFriendRequest,
  deleteFriendRequest,
} = require('../controllers/profile')

router.get('/:userId', auth, getUserProfile)
router.get('/', auth, getMyProfile)
router.post(
  '/create',
  auth,
  upload.single('avatar'),
  profileValidator,
  validationResult,
  createProfile,
)
router.post(
  '/edit',
  auth,
  upload.single('avatar'),
  profileValidator,
  validationResult,
  editProfile,
)
router.get('/follow/:profileId', auth, followAndUnfollow)
router.get('/friends', auth, FriendList)
router.get('/friendrequests', auth, friendRequests)
router.get('/addFriend/:userId', auth, addFriend)
router.get('/unfriend/:userId', auth, unfriend)
router.get('/acceptrequest/:userId', auth, acceptFriendRequest)
router.get('/deletefriendrequest/:userId', auth, deleteFriendRequest)
module.exports = router
