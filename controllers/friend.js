const User = require('../models/User')
const Profile = require('../models/Profile')
const Notification = require('../models/Notification')

const followAndUnfollow = async (req, res, next) => {
  //profile id whom i want to follow
  const { userId } = req.params
  try {
    const profileToFollow = await Profile.findOne({
      //searching the profile
      user: userId
    })
    const profileId = profileToFollow._id

    const loggedInUserProfile = await Profile.findOne({
      user: req.user._id
    }) //searching the logged in user profile

    if (
      !profileToFollow ||
      !loggedInUserProfile ||
      profileToFollow.user.toString() === loggedInUserProfile.user.toString()
    ) {
      throw new Error('profile deesnt exist!')
    }
    //checking if the logged in user already follows the person .then i will let him unfollow the user
    if (profileToFollow.followers.includes(req.user._id)) {
      await Profile.updateOne(
        {
          _id: profileId
        },
        {
          $pull: {
            followers: req.user._id //unfollowing the user.
          }
        }
      )

      await Profile.updateOne(
        {
          user: req.user._id
        },
        {
          $pull: {
            following: profileToFollow.user
          }
        }
      )

      return res.status(200).json({
        success: true,
        message: 'user unfollowed successfully'
      })
    }

    //if the logged in user dont follow the user then i will let him follow the user
    await Profile.updateOne(
      {
        _id: profileId
      },
      {
        $push: {
          followers: req.user._id
        }
      }
    )
    await Profile.updateOne(
      {
        user: req.user._id
      },
      {
        $push: {
          following: profileToFollow.user
        }
      }
    )
    //creating a notification
    const notification = await Notification.create({
      sender: req.user._id,
      reciever: profileToFollow.user,
      event: 'follow',
      source: {
        sourceId: loggedInUserProfile._id,
        referance: 'Profile'
      }
    })
    global.io.emit('Notification', notification)

    res.status(200).json({
      success: true,
      message: 'user followed successfully'
    })
  } catch (e) {
    next(e)
  }
}

const FriendList = async (req, res, next) => {
  try {
    const loggedInUser = req.user._id
    const profile = await Profile.findOne({ user: loggedInUser }).populate(
      'friends'
    ) //populating all the friends
    if (!profile) {
      throw new Error('you have to create a profile first')
    }
    if (profile.friends.length <= 0) {
      return res.status(200).json({
        success: true,
        friends: 'Your friend list is empty!'
      })
    }
    res.status(200).json({
      success: true,
      friends: profile.friends
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
  if (profile.friendRequests.length <= 0) {
    return res.status(200).json({
      success: true,
      friendRequests: 'you dont have any friend request!'
    })
  }
  res.status(200).json({
    success: true,
    friendRequests: profile.friendRequests
  })
}

const addFriend = async (req, res, next) => {
  const { userId } = req.params

  try {
    if (req.user._id.toString() === userId.toString()) {
      //checking if the user is not sending friend requests to himself.
      throw new Error('user not found')
    }
    const profile = await Profile.findOne({ user: userId })
    const loggedInUserProfile = await Profile.findOne({ user: req.user._id })
    if (!profile) throw new Error('users profile doesnt exist!')
    if (profile.friends.includes(req.user._id))
      throw new Error('user is already in your friend list')
    if (profile.friendRequests.includes(req.user._id)) {
      await Profile.updateOne(
        { user: userId },
        {
          $pull: {
            friendRequests: req.user._id
          }
        }
      )
      return res.status(200).json({
        success: true,
        message: 'friend request canceled!'
      })
    }

    await Profile.updateOne(
      { user: userId },
      {
        $push: {
          friendRequests: req.user._id
        }
      }
    )
    await Profile.updateOne(
      { _id: loggedInUserProfile._id },
      {
        $push: {
          sendedFriendRequests: userId
        }
      }
    )
    const notification = await Notification.create({
      sender: req.user._id,
      reciever: userId,
      event: 'friendRequest',
      source: {
        sourceId: loggedInUserProfile._id,
        referance: 'Profile'
      }
    })
    global.io.emit('Notification', notification)

    res.status(200).json({
      success: true,
      message: 'friend request send'
    })
  } catch (e) {
    next(e)
  }
}

const acceptFriendRequest = async (req, res, next) => {
  const { userId } = req.params //friend req sender id
  try {
    const requestSenderProfile = await Profile.findOne({ user: userId }) //sender
    const loggedInUserProfile = await Profile.findOne({ user: req.user._id }) //reciever

    if (!loggedInUserProfile.friendRequests.includes(userId)) {
      throw new Error('no friend request found!')
    }
    if (!requestSenderProfile) throw new Error('user not found!')
    await Profile.updateOne(
      { user: req.user._id },
      {
        $pull: {
          friendRequests: userId
        }
      }
    )
    await Profile.updateOne(
      { user: userId },
      {
        $push: {
          friends: req.user._id
        }
      }
    )
    await Profile.updateOne(
      { user: userId },
      {
        $pull: {
          sendedFriendRequests: req.user._id
        }
      }
    )
    await Profile.updateOne(
      { user: req.user._id },
      {
        $push: {
          friends: userId
        }
      }
    )

    const notification = await Notification.create({
      sender: req.user._id,
      reciever: userId,
      event: 'acceptFriendRequest',
      source: {
        sourceId: loggedInUserProfile._id,
        referance: 'Profile'
      }
    })
    global.io.emit('Notification', notification)

    res.status(200).json({
      success: true,
      message: `${requestSenderProfile.name} is now your friend`
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
          friendRequests: userId
        }
      }
    )
    res.status(200).json({
      success: true,
      message: 'friend request deleted successfully!'
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
          friends: req.user._id
        }
      }
    )
    await Profile.updateOne(
      { user: req.user._id },
      {
        $pull: {
          friends: userId
        }
      }
    )
    res.status(200).json({
      success: true,
      message: `${userToUnfriendprofile.name} is no longer your friend`
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  followAndUnfollow,
  FriendList,
  friendRequests,
  addFriend,
  unfriend,
  acceptFriendRequest,
  deleteFriendRequest
}
