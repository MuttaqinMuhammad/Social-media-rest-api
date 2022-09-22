const Comment = require('../../models/post/Comment')
const Post = require('../../models/post/Post')
const Reply = require('../../models/post/Replie')
const Notification = require('../../models/Notification')
const notifyAllCommentators = require('../../helpers/notification/notifyAllCommentators')

const createComment = async (req, res, next) => {
  const { postId } = req.params
  const user = req.user._id

  try {
    const post = await Post.findOne({ _id: postId })
    if (!post) throw new Error('no post exist to comment!')
    const comment = new Comment({
      body: req.body.body,
      user,
      postId
    })

    const userComment = await comment.save()

    const updatedPost = await Post.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $push: {
          comments: userComment._id
        }
      },
      {
        new: true
      }
    ).populate('comments')

    if (userComment.user.toString() === updatedPost.user.toString()) {
      await notifyAllCommentators(req.user, updatedPost)
      return res.status(200).json({
        success: true,
        userComment
      })
    }

    const notification = await Notification.create({
      sender: req.user._id,
      reciever: post.user,
      event: 'comment',
      source: {
        sourceId: postId,
        referance: 'Post'
      }
    })
    global.io.emit('Notification', notification)
    res.status(200).json({
      success: true,
      userComment
    })
  } catch (e) {
    next(e)
  }
}

const editComment = async (req, res, next) => {
  const { commentId } = req.params
  const user = req.user._id

  try {
    const comment = await Comment.findOne({
      _id: commentId,
      user
    })
    if (comment) {
      await Comment.updateOne(
        {
          _id: commentId
        },
        {
          $set: {
            body: req.body.body
          }
        }
      )
    } else {
      throw new Error('only the creator can edit his comment')
    }
    res.status(200).json({
      success: true
    })
  } catch (e) {
    next(e)
  }
}

const deleteComment = async (req, res, next) => {
  const { commentId } = req.params

  try {
    const comment = await Comment.findOne({
      _id: commentId,
      user: req.user._id
    })
    if (comment) {
      await Comment.deleteOne({
        _id: commentId,
        user: req.user._id
      })
      await Post.updateOne(
        {
          _id: comment.postId
        },
        {
          $pull: {
            comments: comment._id
          }
        }
      )
      await Reply.deleteMany({ _id: { $in: comment.replies } })

      res.status(200).json({
        success: true
      })
    }

    throw new Error('no comment found')
  } catch (e) {
    next(e)
  }
}

const like = async (req, res, next) => {
  try {
    const { commentId } = req.params
    const user = req.user._id
    const comment = await Comment.findOne({
      _id: commentId
    })

    if (comment.dislikes.includes(user)) {
      await Comment.updateOne(
        {
          _id: commentId
        },
        {
          $pull: {
            dislikes: user
          }
        }
      )
    } else if (comment.likes.includes(user)) {
      await Comment.updateOne(
        {
          _id: commentId
        },
        {
          $pull: {
            likes: user
          }
        }
      )

      return res.status(200).json({
        success: true,
        message: 'like removed'
      })
    }

    await Comment.updateOne(
      {
        _id: commentId
      },
      {
        $push: {
          likes: user
        }
      }
    )

    if (comment.user.toString() !== user.toString()) {
      const notification = await Notification.create({
        sender: user,
        reciever: comment.user,
        event: 'like',
        source: {
          sourceId: comment._id,
          referance: 'Comment'
        }
      })
      global.io.emit('Notification', notification)
    }
    res.status(200).json({
      success: true
    })
  } catch {
    const error = new Error()
    error.message = 'there was a server side error'
    next(error)
  }
}

const dislike = async (req, res, next) => {
  try {
    const { commentId } = req.params
    const user = req.user._id
    const comment = await Comment.findOne({
      _id: commentId
    })

    if (comment.likes.includes(user)) {
      await Comment.updateOne(
        {
          _id: commentId
        },
        {
          $pull: {
            likes: user
          }
        }
      )
    } else if (comment.dislikes.includes(user)) {
      await Comment.updateOne(
        {
          _id: commentId
        },
        {
          $pull: {
            dislikes: user
          }
        }
      )

      return res.status(200).json({
        success: true
      })
    }

    await Comment.updateOne(
      {
        _id: commentId
      },
      {
        $push: {
          dislikes: user
        }
      }
    )

    res.status(200).json({
      success: true
    })
  } catch {
    const error = new Error()
    error.message = 'there was a server side error'
    next(error)
  }
}

module.exports = {
  createComment,
  editComment,
  deleteComment,
  like,
  dislike
}
