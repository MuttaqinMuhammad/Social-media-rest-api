const Profile = require('../models/Profile')
const User = require('../models/User')
const createProfile = async (req, res, next)=> {
console.log(req.body)
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
	const {	
		nickname,
		bio,
		address,
		occupation,
		worksAt,
		hobby,
	} = req.body
try {
const editedProfile = await Profile.updateOne({user:req.user._id}, {
	$set:{
		nickname,
		bio,
		address,
		occupation,
		worksAt,
		hobby,
	}
	}, {new:true})

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