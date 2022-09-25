const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/post/Post')
const Comment = require('../../models/post/Comment')
const Reply = require('../../models/post/Replie')

const deleteCommentsAndReplies = (post) => {
  const comments =
    post.comments && post.comments.length > 0 ? post.comments : null
  if (comments) {
    comments.forEach(async (commentId) => {
      const singleComment = await Comment.findOne({
        _id: commentId
      })

      const replies =
        singleComment.replies && singleComment.replies.length > 0
          ? singleComment.replies
          : null

      if (replies) {
        await Reply.deleteMany({ _id: { $in: replies } })
      }

      await Comment.deleteOne({
        _id: commentId
      })
    })
  }
}

module.exports = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const { posts } = await Profile.findOne({ user: userId })
      console.log(posts)
      if (posts.length <= 0) {
        return
      }
      posts.forEach(async (postId) => {
        console.log(postId)
        const post = await Post.findOne({ _id: postId })
        await deleteCommentsAndReplies(post)
      })
      await Post.deleteMany({ _id: { $in: posts } })
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })
