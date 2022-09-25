// internal import
const Post = require('../../models/post/Post')
const Comment = require('../../models/post/Comment')
const cloudinary = require('../../helpers/cloudinary')
const Profile = require('../../models/Profile')
const Reply = require('../../models/post/Replie')
const Notification = require('../../models/Notification')

//helpers
const friendsAndFollowingPosts = require('../../helpers/post/FriendsAndFollowingPosts')


/*
Description: this function takes a user id .search profile and returns all the user posts
*/
const getMyPosts = async (req, res, next) => {
  const myPostsArray = []

  try {
    const { posts } = await Profile.findOne({ user: req.user._id })
    for (let post of posts) {
      let myPost = await Post.findOne({ _id: post }).populate(
        'likes dislikes user comments'
      )
      myPostsArray.push(myPost)
    }

    res.status(200).json({
      success: true,
      myPostsArray
    })
  } catch (e) {
    next(e)
  }
}
/*
Description: this function takes a user id .search profile and returns all the user posts
*/
const getUserPosts = async (req, res, next) => {
  const userPostsArray = []
  const user = req.user._id
  try {
    const getPublicPosts = await Post.find({privicy:'public'})
    const getFriendsAndFollowingPosts = friendsAndFollowingPosts(user)
userPostsArray.concat(getPublicPosts)
userPostsArray.concat(getFriendsAndFollowingPosts)
    res.status(200).json({
      success: true,
      userPostsArray
    })
  } catch (e) {
    next(e)
  }
}

/*
Description: this function takes caption and body from req.body and creates a  post.
*/


const createPost = async (req, res, next) => {
  const { caption, body } = req.body
  const post = new Post({
    user: req.user._id,
    caption,
    body,
    privicy,
  })
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      const { secure_url, public_id } = result
      post.image = {
        url: secure_url,
        public_id
      }
    }

    const newPost = await post.save()
//pushing the post id in user profile .
    await Profile.updateOne(
      {
        user: req.user._id
      },
      {
        $push: {
          posts: newPost._id
        }
      }
    )
    res.status(200).json({
      success: true,
      newPost
    })
  } catch (e) {
    next(e)
  }
}
/*
Description: this function edits user posts .
*/
const editPost = async (req, res, next) => {
  const { postId } = req.params
  const { caption, body } = req.body

  try {
    //checks if the client is the post author
    const verifyAuthor = await Post.findOne({
      _id: postId,
      user: req.user._id
    })

    if (verifyAuthor) {
      if (req.file) {
        if (verifyAuthor.image) {
          await cloudinary.uploader.destroy(verifyAuthor.image.public_id)
        }
        const result = await cloudinary.uploader.upload(req.file.path)

        const { secure_url, public_id } = result
//updating the image.
        await Post.updateOne(
          { _id: postId },
          {
            $set: {
              image: {
                url: secure_url,
                public_id
              }
            }
          }
        )
      }
// updating the post caption and body
      const post = await Post.updateOne(
        {
          _id: postId
        },
        {
          $set: {
            caption,
            body
          }
        }
      )
      res.status(200).json({
        success: true,
        error: false
      })
    } else {
      throw new Error('not found')
    }
  } catch (e) {
    next(e)
  }
}
/*
Description: this function takes a post id and deletes the post
*/
const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const post = await Post.findOne({
      _id: postId
    })
//deleting post
    await Post.deleteOne({
      _id: postId,
      user: req.user._id
    })
    //deleting post image
    await cloudinary.uploader.destroy(post.image.public_id)
//removing the post id from user profile 
    await Profile.updateOne(
      {
        user: req.user._id
      },
      {
        $pull: {
          posts: postId
        }
      }
    )

/*
function name: removeChilds
 Description: this function takes a single post Object and finds every comments and replies and delete those.
*/
Post.removeChilds(post)

    res.status(200).json({
      success: true,
      error: false
    })
  } catch {
    const error = new Error()
    error.message = 'there was a server side error'

    next(error)
  }
}

/*
Description: this function takes a postId form req.params and like that post if the user already liked the post this function removes the like.
*/
const like = async (req, res, next) => {
  try {
    const { postId } = req.params
    const user = req.user._id
    const post = await Post.findOne({
      _id: postId
    })

    if (post.dislikes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId
        },
        {
          $pull: {
            dislikes: user
          }
        }
      )
    } else if (post.likes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId
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

    await Post.updateOne(
      {
        _id: postId
      },
      {
        $push: {
          likes: user
        }
      }
    )

    if (post.user.toString() !== user.toString()) {
      const notification = await Notification.create({
        sender: req.user._id,
        reciever: post.user,
        event: 'like',
        source: {
          sourceId: post._id,
          referance: 'Post'
        }
      })
      global.io.emit('Notification', notification)
    }
    res.status(200).json({
      success: true,
      error: false
    })
  } catch (e) {
    next(e)
  }
}
/*
Description: this function takes a postId form req.params and dislike that post if the user already disliked the post this function removes the dislike.
*/
const dislike = async (req, res, next) => {
  try {
    const { postId } = req.params
    const user = req.user._id
    const post = await Post.findOne({
      _id: postId
    })

    if (post.likes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId
        },
        {
          $pull: {
            likes: user
          }
        }
      )
    } else if (post.dislikes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId
        },
        {
          $pull: {
            dislikes: user
          }
        }
      )

      return res.status(200).json({
        success: true,
        error: false
      })
    }

    await Post.updateOne(
      {
        _id: postId
      },
      {
        $push: {
          dislikes: user
        }
      }
    )

    res.status(200).json({
      success: true,
      error: false
    })
  } catch (e) {
    const error = new Error()
    error.message = 'there was a server side error'
    next(error)
  }
}

//exporting all he functions
module.exports = {
  getMyPosts,
  getUserPosts,
  createPost,
  editPost,
  deletePost,
  like,
  dislike
}
