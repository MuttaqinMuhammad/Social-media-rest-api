// internal import
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const cloudinary = require('../config/cloudinary')
const Profile = require('../models/Profile')
const Reply = require('../models/Replie')




const createPost = async (req, res, next)=> {
  const {
    caption,
    body
  } = req.body
  const post = new Post({
    user: req.user._id,
    caption,
    body,
  })
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      const {
        secure_url,
        public_id
      } = result
      post.image = {
        url: secure_url,
        public_id,
      }
    }



    const newPost = await post.save()
    await Profile.updateOne({
      user: req.user._id
    }, {

      $push: {
        "posts": newPost._id
      }

    })
    res.status(200).json({
      success: true,
      newPost,
    })
  } catch (e) {
    next(e)
  }

}




const editPost = async (req, res, next)=> {
  const result = await cloudinary.uploader.upload(req.file.path);
  const {
    secure_url,
    public_id
  } = result
  const {
    postId
  } = req.params
  const {
    caption,
    body,
  } = req.body


  try {
    //checks if the client is the post author
    const verifyAuthor = await Post.findOne({
      _id: postId, user: req.user._id
    })

    if (verifyAuthor) {
      if (req.file) {

        if (verifyAuthor.image) {
          await cloudinary.uploader.destroy(verifyAuthor.image.public_id)
        }
      }

      const post = await Post.updateOne({
        _id: postId
      }, {
        $set: {
          caption,
          body,
          image: {
            url: secure_url,
            public_id,
          },
        }
      })
      res.status(200).json({
        success: true,
      })

    } else {
      throw new Error('not found')
    }
  } catch (e) {
    next(e)
  }

}

const deletePost = async (req, res, next)=> {
  const {
    postId
  } = req.params
  try {
    const post = await Post.findOne({
      _id: postId
    })

    await Post.deleteOne({
      _id: postId, user: req.user._id
    })

    await Profile.UpdateOne({
      user: req.user._id
    }, {
      $pull: {
        posts: postId
      }
    })
  
    if (post.comments.length > 0) {
      const comments = post.comments
      comments.forEach(async commentId=> {
        const singleComment = await Comments.findOne({
          _id: commentId
        })

        if (singleComment.replies.length > 0) {
          const replies = singleComment.replies
          replies.forEach(async replyId=> {
            await Reply.deleteOne({
              _id: replyId
            })
          })
        }

        await Comment.deleteOne({
          _id: commentId
        })
      })

    }


    res.status(200).json({
      success: true
    })

  } catch (e) {
    next(e)
  }
}

const like = async (req, res, next)=> {

  try {
    const {
      postId
    } = req.params
    const user = req.user._id
    const post = await Post.findOne({
      _id: postId
    })

    if (post.dislikes.includes(user)) {
      await Post.updateOne({
        _id: postId,
      }, {
        $pull: {
          "dislikes": user
        }
      })
    } else if (post.likes.includes(user)) {
      await Post.updateOne({
        _id: postId,
      }, {
        $pull: {
          "likes": user
        }
      })

      return res.status(200).json({
        success: true
      })
    }

    await Post.updateOne({
      _id: postId,
    }, {
      $push: {
        "likes": user
      }
    })

    res.status(200).json({
      success: true

    })
  }catch(e) {
    next(e)
  }
}

const dislike = async (req, res, next)=> {
  try {

    const {
      postId
    } = req.params
    const user = req.user._id
    const post = await Post.findOne({
      _id: postId
    })

    if (post.likes.includes(user)) {
      await Post.updateOne({
        _id: postId,
      }, {
        $pull: {
          "likes": user
        }
      })
    } else if (post.dislikes.includes(user)) {
      await Post.updateOne({
        _id: postId,
      }, {
        $pull: {
          "dislikes": user
        }
      })

      return res.status(200).json({
        success: true
      })

    }

    await Post.updateOne({
      _id: postId,
    }, {
      $push: {
        "dislikes": user
      }
    })

    res.status(200).json({
      success: true
    })
  }catch(e) {
    next(e)
  }
}




module.exports = {
  createPost,
  editPost,
  deletePost,
  like,
  dislike,
}