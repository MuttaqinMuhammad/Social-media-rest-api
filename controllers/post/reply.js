const Reply = require('../../models/post/Replie')
const Comment = require('../../models/post/Comment')
const Notification = require('../../models/Notification')

const createReply = async (req, res, next) => {
  const { commentId } = req.params
  const user = req.user._id
  const reply = new Reply({
    body: req.body.body,
    user,
    commentId,
  })

  try {
    const comment = await Comment.findOne({ _id: commentId })
    if (!comment) throw new Error('comment doesnt exist to reply!')
    const userReply = await reply.save()
    await Comment.updateOne(
      {
        _id: commentId,
      },
      {
        $push: {
          replies: userReply._id,
        },
      },
    )
    
    const notification = await Notification.create({
      sender: user,
      reciever: comment.user,
      event: 'reply',
      source: {
        sourceId: comment._id,
        referance: 'comment',
      },
    })
    global.io.emit('Notification', notification)
 const status =  await Notification.notifyOtherReplyUsers(user, commentId)
    console.log(`status ${status}`)
    
    res.status(200).json({
      success: true,
      userReply,
    })
  } catch(e) {
    next(e)
  }
}

const editReply = async (req, res, next) => {
  try {
    const { replyId } = req.params
    const user = req.user._id
    const reply = await Reply.findOne({
      replyId,
    })
    await Reply.updateOne(
      {
        _id: replyId,
        user,
      },
      {
        $set: {
          body: req.body.body,
        },
      },
    )

    res.status(200).json({
      success: true,
      error:false,
    })
  } catch (error) {
    error.message = 'only comment createor can edit his comment'
    next(error)
  }
}

const deleteReply = async (req, res, next) => {
  const user = req.user._id
  try {
    const { replyId } = req.params
    const reply = await Reply.findOne({
      _id: replyId,
      user,
    })
    await Reply.deleteOne({
      _id: replyId,
      user,
    })
    await Comment.updateOne(
      {
        _id: reply.commentId,
      },
      {
        $pull: {
          replies: reply._id,
        },
      },
    )
    res.status(200).json({
      success: true,
      error:false,
    })
  } catch {
    const error = new Error('there was a server side error')
    next(error)
  }
}

const like = async (req, res, next) => {
  try {
    const { replyId } = req.params
    const user = req.user._id
    const reply = await Reply.findOne({
      _id: replyId,
    })

    if (reply.dislikes.includes(user)) {
      await Reply.updateOne(
        {
          _id: replyId,
        },
        {
          $pull: {
            dislikes: user,
          },
        },
      )
    } else if (reply.likes.includes(user)) {
      await Reply.updateOne(
        {
          _id: replyId,
        },
        {
          $pull: {
            likes: user,
          },
        },
      )

      return res.status(200).json({
        success: true,
        error:false,
      })
    }

    await Reply.updateOne(
      {
        _id: replyId,
      },
      {
        $push: {
          likes: user,
        },
      },
    )
    const notification = await Notification.create({
      sender: req.user._id,
      reciever: reply.user,
      event: 'like',
      source: {
        sourceId: reply._id,
        referance: 'reply',
      },
    })
    console.log(notification)
    global.io.emit('Notification', notification)

    res.status(200).json({
      success: true,
      error:false,
    })
  } catch {
    const error = new Error('there was a server side error')
    next(error)
  }
}

const dislike = async (req, res, next) => {
  try {
    const { replyId } = req.params
    const user = req.user._id
    const reply = await Reply.findOne({
      _id: replyId,
    })

    if (reply.likes.includes(user)) {
      await Reply.updateOne(
        {
          _id: replyId,
        },
        {
          $pull: {
            likes: user,
          },
        },
      )
    } else if (reply.dislikes.includes(user)) {
      await Reply.updateOne(
        {
          _id: replyId,
        },
        {
          $pull: {
            dislikes: user,
          },
        },
      )

      return res.status(200).json({
        success: true,
        error:false,
      })
    }

    await Reply.updateOne(
      {
        _id: replyId,
      },
      {
        $push: {
          dislikes: user,
        },
      },
    )

    res.status(200).json({
      success: true,
      error:false,
    })
  } catch {
    const error = new Error('there was a server side error')
    next(error)
  }
}

module.exports = {
  createReply,
  editReply,
  deleteReply,
  like,
  dislike,
}
