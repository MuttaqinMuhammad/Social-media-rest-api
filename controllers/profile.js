const Profile = require('../models/Profile')
const User = require('../models/User')
const cloudinary = require('../config/cloudinary')


const createProfile = async (req, res, next)=> {
	const result = await cloudinary.uploader.upload(req.file.path)
const { secure_url, public_id } = result
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
		avatar:{
		 secure_url,
		 public_id 
		},
		worksAt,
		hobby,
		user: req.user._id,
		name: req.user.name,
	})
	try {
		const createdProfile = await profile.save()
		await User.updateOne({
			_id: req.user._id
		}, {
			$set: {
				profile: createProfile._id,
			}
		})
		
		res.status(200).json({
			success:true,
			createdProfile,
		})
	} catch (e) {
		next(e)
	}




}


const editProfile = async (req, res, next)=>{
try {
		const result = await cloudinary.uploader.upload(req.file.path)
		console.log(result)
let { secure_url, public_id } = result
	const {	
		nickname,
		bio,
		address,
		occupation,
		worksAt,
		hobby,
	} = req.body
	
	if(req.file){
const profile = await Profile.findOne({user:req.user._id})
if (profile.avatar.public_id) {
	await cloudinary.uploader.destroy(profile.avatar.public_id)
}
		
	} 
	
	

const editedProfile = await Profile.updateOne({user:req.user._id}, {
	$set:{
		nickname,
		bio,
		address,
		avatar:{
			 secure_url, public_id 
		},
		occupation,
		worksAt,
		hobby,
	}
	}, {new:true})
await User.updateOne({_id:req.user._id}, {
	$set:{
		avatar:{
		secure_url,
	  public_id 
		}
	}
}) 
res.status(200).json({
	success:true,
	editedProfile,
})

} catch (e) {
	next(e)
}
	
}

module.exports = {
	createProfile,
	editProfile,
}