const Profile = require('../../models/Profile')
const Post = require('../../models/post/Post')

module.exports = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      let friendsAndFollowingPosts = []
      const { friends, following } = await Profile.findOne({ user: userId })
      const allPostAuthors = friends.concat(following)

      const profiles = await Profile.find({
        user: { $in: allPostAuthors }
      }).populate('posts')

      for (let profile of profiles) {
        const getPosts = profile.posts.filter(
          (post) => post.privicy.toUpperCase() !== 'PRIVATE'
        )
        friendsAndFollowingPosts.push(...getPosts)
      }

      resolve(friendsAndFollowingPosts)
    } catch (e) {
      reject(e)
    }
  })
