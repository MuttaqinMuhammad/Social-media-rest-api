const Profile = require('../models/Profile')
const User = require('../models/User')
const cloudinary = require('../helpers/cloudinary')

const getUserProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate('posts followers following user')
    if (profile) {
      return res.status(200).json({
        success: true,
        profile,
      })
    }
    throw new Error('you have to create a profile first')
  } catch (e) {
    next(e)
  }
}

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id,
    }).populate('user following followers posts friends')
    if (!profile) {
      throw new Error('profile doesnt exist create a profile at first')
    }
    res.status(200).json({
      success: true,
      profile,
    })
  } catch (e) {
    next(e)
  }
}

const createProfile = async (req, res, next) => {
  const { nickname, bio, address, occupation, worksAt, hobby } = req.body

  const profile = new Profile({
    nickname,
    bio,
    address,
    occupation,
    worksAt,
    hobby,
    user: req.user._id,
    name: req.user.name,
  })

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path)
    const { secure_url, public_id } = result
    profile.avatar = {
      url: secure_url,
      public_id,
    }
  }

  try {
    const isprofileExist = await Profile.findOne({
      user: req.user._id,
    })
    if (isprofileExist && isprofileExist._id) {
      throw new Error('profile already exist!')
    }

    const createdProfile = await profile.save()
    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $set: {
          profile: createdProfile._id,
        },
      },
    )

    res.status(200).json({
      success: true,
      createdProfile,
    })
  } catch (e) {
    next(e)
  }
}

const editProfile = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path)
    let { secure_url, public_id } = result
    const { nickname, bio, address, occupation, worksAt, hobby } = req.body

    if (req.file) {
      const profile = await Profile.findOne({
        user: req.user._id,
      })
      if (profile.avatar.public_id) {
        await cloudinary.uploader.destroy(profile.avatar.public_id)
      }
    }

    const editedProfile = await Profile.updateOne(
      {
        user: req.user._id,
      },
      {
        $set: {
          nickname,
          bio,
          address,
          avatar: {
            url: secure_url,
            public_id,
          },
          occupation,
          worksAt,
          hobby,
        },
      },
    )
    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $set: {
          avatar: {
            url: secure_url,
            public_id,
          },
        },
      },
    )
    res.status(200).json({
      success: true,
      editedProfile,
    })
  } catch (e) {
    next(e)
  }
}

const followAndUnfollow = async (req, res, next) => {
  //profile id whom i want to follow
  const { profileId } = req.params
  try {
    //his profile

    //
    const profileToFollow = await Profile.findOne({
      _id: profileId,
    })

    const loggedInUserProfile = await Profile.findOne({
      user: req.user._id,
    })

    if (
      !profileToFollow &&
      !loggedInUserProfile &&
      profileToFollow.user === loggedInUserProfile.user
    ) {
      throw new Error('profile deesnt exist!')
    }
    //checking if the logged in user already follows the person .then i will let him unfollow the user
    if (profileToFollow.followers.includes(req.user._id)) {
      await Profile.updateOne(
        {
          _id: profileId,
        },
        {
          $pull: {
            followers: req.user._id,
          },
        },
      )

      await Profile.updateOne(
        {
          user: req.user._id,
        },
        {
          $pull: {
            following: profileToFollow.user,
          },
        },
      )

      return res.status(200).json({
        success: true,
        message: 'user unfollowed successfully',
      })
    }

    //if the logged in user dont follow the user then i will let him follow the user
    await Profile.updateOne(
      {
        _id: profileId,
      },
      {
        $push: {
          followers: req.user._id,
        },
      },
    )
    await Profile.updateOne(
      {
        user: req.user._id,
      },
      {
        $push: {
          following: profileToFollow.user,
        },
      },
    )

    return res.status(200).json({
      success: true,
      message: 'user followed successfully',
    })
  } catch (e) {
    next(e)
  }
}

const FriendList = async (req, res, next) => {
  try {
    const loggedInUser = req.user._id
    const profile = await Profile.findOne({ user: loggedInUser })
    if (!profile) {
      throw new Error('you have to create a profile first')
    }
    if (profile.friends.length === 0) {
      return res.status(200).json({
        success: true,
        friends: [],
      })
    }
    res.status(200).json({
      success: true,
      friends: profile.friends,
    })
  } catch (e) {
    next(e)
  }
}
const friendRequests = async (req, res, next) => {
  const loggedInUser = req.user._id
  const profile = await Profile.findOne({ user: loggedInUser })
  if (!profile) {
    throw new Error('you have to create a profile first!')
  }
  if (profile.friendRequests.length === 0) {
    return res.status(200).json({
      success: true,
      friendRequests: [],
    })
  }
  res.status(200).json({
    success: true,
    friendRequests: profile.friendRequests,
  })
}

const addFriend = async (req, res, next) => {
  const { userId } = req.params

  try {
    if (req.user._id.toString() === userId.toString()) {
      throw new Error('user not found')
    }
    const profile = await Profile.findOne({ user: userId })
    if (profile.friendRequests.includes(req.user._id)) {
      await Profile.updateOne(
        { user: userId },
        {
          $pull: {
            friendRequests: req.user._id,
          },
        },
      )
      return res.status(200).json({
        success: true,
        message: 'friend request canceled!',
      })
    }
    if (profile.friends.includes(req.user._id)) {
      throw new Error('user is already in your friend list')
    }

    await Profile.updateOne(
      { user: userId },
      {
        $push: {
          friendRequests: req.user._id,
        },
      },
    )
    res.status(200).json({
      success: true,
      message: 'friend request send',
    })
  } catch (e) {
    next(e)
  }
}

const acceptFriendRequest = async (req, res, next) => {
  const { userId } = req.params //friend req sender is
  try {
    const requestSenderProfile = await Profile.findOne({ user: userId }) //sender
    const loggedInUserProfile = await Profile.findOne({ user: req.user._id }) //reciever

    if (!loggedInUserProfile.friendRequests.includes(userId)) {
      throw new Error('no friend request found!')
    }

    await Profile.updateOne(
      { user: req.user._id },
      {
        $pull: {
          friendRequests: userId,
        },
      },
    )
    await Profile.updateOne(
      { user: userId },
      {
        $push: {
          friends: req.user._id,
        },
      },
    )
    await Profile.updateOne(
      { user: req.user._id },
      {
        $push: {
          friends: userId,
        },
      },
    )

    res.status(200).json({
      success: true,
      message: `${requestSenderProfile.nickname} is now your friend`,
    })
  } catch (e) {
    next(e)
  }
}

const deleteFriendRequest = async (req, res, next) => {
  const { userId } = req.params
  try {
    const requestSenderProfile = await Profile.findOne({ user: userId }) //request sender profile
    const loggedInUserProfile = await Profile.findOne({ user: req.user._id })

    if (!loggedInUserProfile.friendRequests.includes(userId)) {
      throw new Error('no friend request found!')
    }

    await Profile.updateOne(
      { user: req.user._id },
      {
        $pull: {
          friendRequests: userId,
        },
      },
    )
    res.status(200).json({
      success: true,
      message: 'friend request deleted successfully!',
    })
  } catch (e) {
    next(e)
  }
}

const unfriend = async (req, res, next) => {
  const { userId } = req.params
  try {
    if (req.user._id.toString() === userId.toString()) {
      throw new Error('failed to unfriend user!')
    }
    const userToUnfriendprofile = await Profile.findOne({ user: userId })
    const loggedInUserProfile = await Profile.findOne({ user: req.user._id })
    if (
      !userToUnfriendprofile.friends.includes(req.user._id) &&
      !loggedInUserProfile.friends.includes(userId)
    ) {
      throw new Error('user is not in your friend list')
    }

    await Profile.updateOne(
      { user: userId },
      {
        $pull: {
          friends: req.user._id,
        },
      },
    )
    await Profile.updateOne(
      { user: req.user._id },
      {
        $pull: {
          friends: userId,
        },
      },
    )
    res.status(200).json({
      success: true,
      message: `${userToUnfriendprofile.name} is no longer your friend`,
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getMyProfile,
  getUserProfile,
  createProfile,
  editProfile,
  followAndUnfollow,
  FriendList,
  friendRequests,
  addFriend,
  unfriend,
  acceptFriendRequest,
  deleteFriendRequest,
}
