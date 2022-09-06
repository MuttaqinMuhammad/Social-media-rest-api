const Reply = require('../models/Replie')
const Comment = require('../models/Comment')

const createReply = async (req, res, next)=> {
  const {
    commentId
  } = req.params
  const reply = new Reply({
    body: req.body.body,
    user: req.user._id,
  })

  try {
    const userReply = await reply.save()
    await Comment.updateOne({
      _id: commentId
    }, {
      $push: {
        'replies': userReply._id
      }
    })
    res.status(200).json({
      success: true,
      userReply,
    })
  } catch (e) {
    next(e)
  }
}


module.exports = {
  createReply,
}