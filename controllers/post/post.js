// internal import
const Post = require('../../models/post/Post')
const Comment = require('../../models/post/Comment')
const cloudinary = require('../../helpers/cloudinary')
const Profile = require('../../models/Profile')
const Reply = require('../../models/post/Replie')
const Notification = require('../../models/Notification')

const getMyPosts = async (req, res, next) => {
  const myPostsArray = []

  try {
    const { posts } = await Profile.findOne({ user: req.user._id })
    for (let post of posts) {
      let myPost = await Post.findOne({ _id: post }).populate(
        'likes dislikes user comments',
      )
      myPostsArray.push(myPost)
    }

    res.status(200).json({
      success: true,
      myPostsArray,
    })
  } catch (e) {
    next(e)
  }
}
const getUserPosts = async (req, res, next) => {
  const userPostsArray = []

  try {
    const { posts } = await Profile.findOne({ user: req.params.userId })
    for (let post of posts) {
      let myPost = await Post.findOne({ _id: post }).populate(
        'likes dislikes user comments',
      )
      userPostsArray.push(myPost)
    }

    res.status(200).json({
      success: true,
      userPostsArray,
    })
  } catch (e) {
    next(e)
  }
}

const createPost = async (req, res, next) => {
  const { caption, body } = req.body
  const post = new Post({
    user: req.user._id,
    caption,
    body,
  })
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      const { secure_url, public_id } = result
      post.image = {
        url: secure_url,
        public_id,
      }
    }

    const newPost = await post.save()
    await Profile.updateOne(
      {
        user: req.user._id,
      },
      {
        $push: {
          posts: newPost._id,
        },
      },
    )
    res.status(200).json({
      success: true,
      newPost,
    })
  } catch (e) {
    next(e)
  }
}

const editPost = async (req, res, next) => {
  const { postId } = req.params
  const { caption, body } = req.body

  try {
    //checks if the client is the post author
    const verifyAuthor = await Post.findOne({
      _id: postId,
      user: req.user._id,
    })

    if (verifyAuthor) {
      if (req.file) {
        if (verifyAuthor.image) {
          await cloudinary.uploader.destroy(verifyAuthor.image.public_id)
        }
        const result = await cloudinary.uploader.upload(req.file.path)

        const { secure_url, public_id } = result
        await Post.updateOne(
          { _id: postId },
          {
            $set: {
              image: {
                url: secure_url,
                public_id,
              },
            },
          },
        )
      }

      const post = await Post.updateOne(
        {
          _id: postId,
        },
        {
          $set: {
            caption,
            body,
          },
        },
      )
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

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const post = await Post.findOne({
      _id: postId,
    })

    await Post.deleteOne({
      _id: postId,
      user: req.user._id,
    })
    await cloudinary.uploader.destroy(post.image.public_id)
    await Profile.updateOne(
      {
        user: req.user._id,
      },
      {
        $pull: {
          posts: postId,
        },
      },
    )

    Post.removeChilds(post)

    res.status(200).json({
      success: true,
    })
  } catch {
    const error = new Error()
    error.message = 'there was a server side error'

    next(error)
  }
}

const like = async (req, res, next) => {
  try {
    const { postId } = req.params
    const user = req.user._id
    const post = await Post.findOne({
      _id: postId,
    })

    if (post.dislikes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          $pull: {
            dislikes: user,
          },
        },
      )
    } else if (post.likes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          $pull: {
            likes: user,
          },
        },
      )
      return res.status(200).json({
        success: true,
        message: 'like removed',
      })
    }

    await Post.updateOne(
      {
        _id: postId,
      },
      {
        $push: {
          likes: user,
        },
      },
    )
    console.log(post.user.toString() !== user.toString())
    if (post.user.toString() !== user.toString()) {
      const notification = await Notification.create({
        sender: req.user._id,
        reciever: post.user,
        event: 'like',
        source: {
          sourceId: post._id,
          referance: 'post',
        },
      })
      global.io.emit('Notification', notification)
    }
    res.status(200).json({
      success: true,
    })
  } catch {
    const error = new Error()
    error.message = 'there was a server side error'
    next(error)
  }
}

const dislike = async (req, res, next) => {
  try {
    const { postId } = req.params
    const user = req.user._id
    const post = await Post.findOne({
      _id: postId,
    })

    if (post.likes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          $pull: {
            likes: user,
          },
        },
      )
    } else if (post.dislikes.includes(user)) {
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          $pull: {
            dislikes: user,
          },
        },
      )

      return res.status(200).json({
        success: true,
      })
    }

    await Post.updateOne(
      {
        _id: postId,
      },
      {
        $push: {
          dislikes: user,
        },
      },
    )

    res.status(200).json({
      success: true,
    })
  } catch (e) {
    const error = new Error()
    error.message = 'there was a server side error'
    next(error)
  }
}

module.exports = {
  getMyPosts,
  getUserPosts,
  createPost,
  editPost,
  deletePost,
  like,
  dislike,
}
