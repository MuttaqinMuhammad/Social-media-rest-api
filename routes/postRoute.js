const router = require('express').Router()

const auth = require('../middlewares/common/auth')
const upload = require('../helpers/photoUploader')

const {
	createPost,
	editPost,
	deletePost,
	like,
	dislike,
} = require('../controllers/post')

router.post('/create',auth,upload.single('postImage'), createPost)
router.post('/edit/:postId', auth,editPost)
router.post('/delete/:postId', auth,deletePost)
router.post('/feedback/like/:postId', auth, like)
router.post('/feedback/dislike/:postId', auth, dislike)


module.exports = router