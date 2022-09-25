const Reply = require('../../models/post/Replie')
const Comment = require('../../models/post/Comment')
const Notification = require('../../models/Notification')

//helpers
const notifyAllRepliers = require('../../helpers/notification/notifyAllrepliers')



/*
Description: this function takes a comment id and creates a reply.
*/
const createReply = async (req, res, next) => {
  const { commentId } = req.params
  const user = req.user._id
  const reply = new Reply({
    body: req.body.body,
    user,
    commentId
  })

  try {
    //searching the comment.
    const comment = await Comment.findOne({ _id: commentId })
//throwing an error if the comment doesnt exist.
    if (!comment) throw new Error('comment doesnt exist to reply!')
  //saving the reply.
    const userReply = await reply.save()
  //pushing the reply inside the comment (replies Array).
    const updatedComment = await Comment.findOneAndUpdate(
      {
        _id: commentId
      },
      {
        $push: {
          replies: userReply._id
        }
      },
      {
        new: true
      }
    ).populate('user replies')
//if the comment creator is the person who replied the comment.notify all the other person tho replied the comment.

/*
Function name: notifyAllRepliers
Description: this Function takes the comment and the comment creator. finds all the other persons who replied the comment and notify them all.
*/
    if (updatedComment.user._id.toString() === req.user._id.toString()) {
      //sending notification to all the others.
      await notifyAllRepliers(req.user, updatedComment)
      return res.status(200).json({
        success: true,
        updatedComment
      })
    }

//if the person is not the comment creator .also the other persons will be notified.
    const notification = await Notification.create({
      sender: user,
      reciever: comment.user,
      event: 'reply',
      source: {
        sourceId: comment._id,
        referance: 'Comment'
      }
    })
    //emiting the socket event.
    global.io.emit('Notification', notification)

    await notifyAllRepliers(req.user, updatedComment)

    res.status(200).json({
      success: true,
      userReply
    })
  } catch (e) {
    next(e)
  }
}
/*
Description: this Function edits a reply.
*/
const editReply = async (req, res, next) => {
  try {
    const { replyId } = req.params
    const user = req.user._id
  //searching the reply.
    const reply = await Reply.findOne({
      replyId
    })
//throwing error if no reply found.
    if(!reply)throw new Error('no reply found!')
    //updating the reply.
    await Reply.updateOne(
      {
        _id: replyId,
        user
      },
      {
        $set: {
          body: req.body.body
        }
      }
    )

    res.status(200).json({
      success: true,
      error: false
    })
  } catch (error) {
    next(error)
  }
}
/*
Description: this Function deletes a reply.
*/
const deleteReply = async (req, res, next) => {
  const user = req.user._id
  try {
    const { replyId } = req.params
    const reply = await Reply.findOne({
      _id: replyId,
      user
    }) //searching the reply
    if(!reply)throw new Error('no reply found') //throwing an error if no reply exist.
    //deleting the reply
    await Reply.deleteOne({
      _id: replyId,
      user
    }) 
//removing the id from comments(reply Array)
    await Comment.updateOne(
      {
        _id: reply.commentId
      },
      {
        $pull: {
          replies: reply._id
        }
      }
    )
    res.status(200).json({
      success: true,
      error: false
    })
  } catch {
    const error = new Error('there was a server side error')
    next(error)
  }
}

//this Function likes a reply. if already like exist removes that like.

const like = async (req, res, next) => {
  try {
    const { replyId } = req.params
    const user = req.user._id
    
  const reply = await Reply.findOne({ //searching the reply
      _id: replyId
    })
if(!reply)throw new Error('no reply found')//throwing error if no reply found.
    if (reply.dislikes.includes(user)) { //checks the user already dislikes the reply
      await Reply.updateOne(
        {
          _id: replyId
        },
        {
          $pull: {
            dislikes: user        //removing the dislike
          }
        }
      )
    } else if (reply.likes.includes(user)) { //checks if the user already liked the reply
      await Reply.updateOne(
        {
          _id: replyId
        },
        {
          $pull: {
            likes: user         //removing the like.
          }
        }
      )

      return res.status(200).json({
        success: true,
        error: false
      })
    }
//finally push the user to the likes array.
    await Reply.updateOne(
      {
        _id: replyId
      },
      {
        $push: {
          likes: user
        }
      }
    )
//notifying the comment creator.
    if (reply.user.toString() !== user.toString()) {
      const notification = await Notification.create({
        sender: req.user._id,
        reciever: reply.user,
        event: 'like',
        source: {
          sourceId: reply._id,
          referance: 'Replie'
        }
      })

      global.io.emit('Notification', notification)
    }
    res.status(200).json({
      success: true,
      error: false
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
    const reply = await Reply.findOne({ //searching the reply
      _id: replyId
    })
if(!reply)throw new Error('no reply found')
    if (reply.likes.includes(user)) { //checking if the user already liked the reply
      await Reply.updateOne(
        {
          _id: replyId 
        },
        {
          $pull: {
            likes: user     //removing the like
          }
        }
      )
    } else if (reply.dislikes.includes(user)) {//checking if the user already disliked the reply.
      await Reply.updateOne(
        {
          _id: replyId
        },
        {
          $pull: {
            dislikes: user //removing the dislike
          }
        }
      )

      return res.status(200).json({
        success: true,
        error: false
      })
    }

//finally pushing the userid to the dislikes array
    await Reply.updateOne(
      {
        _id: replyId
      },
      {
        $push: {
          dislikes: user    //pushing the dislike.
        }
      }
    )

    res.status(200).json({
      success: true,
      error: false
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
  dislike
}
