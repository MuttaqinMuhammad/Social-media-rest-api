const cloudinary = require('../helpers/cloudinary')
const Story = require('../models/Storie') 

const getStories = async (req, res, next)=>{
try {
const profile = await Profile.findOne({user:req.user._id})
if(profile.friends.lenght === 0) throw new Error('No story to show!')
const getAllStories = profile.friends.push(req.user._id);
const stories = Story.find({
    'creator': { $in: getAllStories }
});
res.status(200).json({
  success:true,
  stories,
})
} catch (e) {
  next(e)
}
  
}
const getSingleStory = async (req, res, next)=>{
  
  
}

const createStory = async (req, res, next)=>{
try {

    if(!req.file){
    throw new Error('story can not be empty!')
    }

   const result = await cloudinary.uploader.upload(req.file.path,{
      folder: "Stories",
    })
      const {
        secure_url,
        public_id
      } = result
    
      
   const story = new Story({
     creator:req.user._id,
     image:{
       secureURL:secure_url,
       publicID:public_id,
     },
     privicy:req.body.privicy,
   })
   const createdStory = await story.save()
  res.status(200).json({
    success:true,
    createdStory,
  })
} catch (e) {
  next(e)
}
  
  
}
const deleteStory = async (req, res, next)=>{
  const { storyId } = req.params
  try {
    const story = await Story.findOne({_id:storyId})
    if(!story){
      throw new Error('No story found!')
    }
  if(story.creator.toString() !== req.user._id.toString()){
    throw new Error('only creators can delete their story!')
  }  
    await cloudinary.uploader.destroy(story.image.publicId)
    await Story.deleteOne({_id:storyId})
    res.status(200).json({
      success:true,
      message:"Story deleted successfuly"
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getStories,
  getSingleStory,
  createStory,
  deleteStory
}