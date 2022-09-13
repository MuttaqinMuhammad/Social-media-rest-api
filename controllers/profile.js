const Profile = require('../models/Profile')
const User = require('../models/User')
const cloudinary = require('../config/cloudinary')


const getUserProfile = async (req, res, next)=> {
  try {
    const profile = await Profile.findOne({
      user: req.params.userId
    }).populate("posts followers following user")
    if (profile) {
      return res.status(200).json({
        success: true,
        profile,
      })
    }
    throw new Error('you have to create a profile first')
  }catch (e) {
    next(e)
  }

}

const getMyProfile = async (req, res, next)=> {
  try {

    const profile = await Profile.findOne({
      user: req.user._id
    }).populate("user following followers posts friends")
    if (!profile) {
      throw new Error("profile doesnt exist create a profile at first")
    }
    res.status(200).json({
      success: true,
      profile,
    })


  } catch (e) {
    next(e)
  }

}

const createProfile = async (req, res, next)=> {


  const {
    nickname,
    bio,
    address,
    occupation,
    worksAt,
    hobby,
  } = req.body


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
    const {
      secure_url,
      public_id
    } = result
    profile.avatar = {
      url: secure_url,
      public_id
    }
  }

  try {
    const isprofileExist = await Profile.findOne({
      user: req.user._id
    })
    if (isprofileExist && isprofileExist._id) {
      throw new Error('profile already exist!')
    }

    const createdProfile = await profile.save()
    await User.updateOne({
      _id: req.user._id
    }, {
      $set: {
        profile: createdProfile._id,
      }
    })

    res.status(200).json({
      success: true,
      createdProfile,
    })
  } catch (e) {
    next(e)
  }




}


const editProfile = async (req, res, next)=> {
  try {
    const result = await cloudinary.uploader.upload(req.file.path)
    let {
      secure_url,
      public_id
    } = result
    const {
      nickname,
      bio,
      address,
      occupation,
      worksAt,
      hobby,
    } = req.body

    if (req.file) {
      const profile = await Profile.findOne({
        user: req.user._id
      })
      if (profile.avatar.public_id) {
        await cloudinary.uploader.destroy(profile.avatar.public_id)
      }

    }



    const editedProfile = await Profile.updateOne({
      user: req.user._id
    }, {
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
      }
    })
    await User.updateOne({
      _id: req.user._id
    }, {
      $set: {
        avatar: {
          url: secure_url,
          public_id,
        }
      }
    })
    res.status(200).json({
      success: true,
      editedProfile,
    })

  } catch (e) {
    next(e)
  }

}

const followAndUnfollow = async (req, res, next)=> {
  //profile id whom i want to follow
  const {
    profileId
  } = req.params
  try {

    //his profile

    //
    const profileToFollow = await Profile.findOne({
      _id: profileId
    })

    const loggedInUserProfile = await Profile.findOne({
      user: req.user._id
    })


    if (!profileToFollow && !loggedInUserProfile && profileToFollow.user === loggedInUserProfile.user) {
      throw new Error('profile deesnt exist!')
    }
    //checking if the logged in user already follows the person .then i will let him unfollow the user
    if (profileToFollow.followers.includes(req.user._id)) {
      await Profile.updateOne({
        _id: profileId
      }, {
        $pull: {
          followers: req.user._id
        }
      })

      await Profile.updateOne({
        user: req.user._id
      }, {
        $pull: {
          following: profileToFollow.user
        }
      })

      return res.status(200).json({
        success: true,
        message: "user unfollowed successfully"
      })
    }


    //if the logged in user dont follow the user then i will let him follow the user
    await Profile.updateOne({
      _id: profileId
    }, {
      $push: {
        followers: req.user._id
      }
    })
    await Profile.updateOne({
      user: req.user._id
    }, {
      $push: {
        following: profileToFollow.user
      }
    })

    return res.status(200).json({
      success: true,
      message: "user followed successfully"
    })


  } catch (e) {
    next(e)
  }


}


const addFriend = async(req, res, next)=> {}



module.exports = {
  getMyProfile,
  getUserProfile,
  createProfile,
  editProfile,
  followAndUnfollow,
}