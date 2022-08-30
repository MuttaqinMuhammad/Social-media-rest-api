const { Schema, model } = require('mongoose')

const userSchema = new Schema({
	name:{
		type:String,
		required:true,
		trim:true(),
	},
	
	email:{
		type:String,
		required:true,
		trim:true,
	},
	
	password:{
		type:String,
		required:true,
		// select:false,
		trim:true,
	},
	
	birthday:{
		type:Date,
		required:true,
	},
	
	gender:{
		type:String,
		enum:['male', 'female', 'custom'],
		required:true,
	},
	
	profile:{
		type:Schema.Types.ObjectId,
		ref:'Profile',
	}
	
	
},{timestamps:true})

const User = new model('User', userSchema)