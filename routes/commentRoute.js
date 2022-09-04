const router = require('express').Router()

const auth = require('../middlewares/common/auth')

const {
	createComment,
	editComment,
	deleteComment,
} =require('../controllers/comment')


router.post('/create/:postId',auth, createComment)
router.post('/edit/:commentId',auth, editComment)
router.delete('/delete/:commentId', auth, deleteComment)

module.exports = router