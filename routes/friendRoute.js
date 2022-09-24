const router = require('express').Router()
const {
  followAndUnfollow,
  FriendList,
  friendRequests,
  addFriend,
  unfriend,
  acceptFriendRequest,
  deleteFriendRequest
} = require('../controllers/friend')

const auth = require('../middlewares/common/auth')
router.get('/follow/:profileId', auth, followAndUnfollow)
router.get('/', auth, FriendList)
router.get('/friendrequests', auth, friendRequests)
router.get('/addFriend/:userId', auth, addFriend)
router.get('/unfriend/:userId', auth, unfriend)
router.get('/acceptrequest/:userId', auth, acceptFriendRequest)
router.get('/deletefriendrequest/:userId', auth, deleteFriendRequest)

module.exports = router
