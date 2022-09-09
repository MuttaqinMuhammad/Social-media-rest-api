const Profile = require('../models/Profile')
const User = require('../models/User')
const cloudinary = require('../config/cloudinary')


const getProfile = async (req, res, next)=> {

  try {
    const profile = await Profile.findOne({
      user: req.user._id
    })
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
    const profile = await Profile.findOne({
      user: req.user._id
    })
    if (profile && profile._id)throw new Error('profile already exist!')


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

module.exports = {
  getProfile,
  createProfile,
  editProfile,
  
}