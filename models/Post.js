const { Schema, model } = require('mongoose')
const postSchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'User',
		required:true,
	},
	title:{
		type:String,
		required:true,
		trim:true,
	},
	body:{
		type:String,
		required:true,
		trim:true,
	},
  attachments:{
  	type:String,
  },
  comments:[
 {
 	 	type:Schema.Types.ObjectId,
  	ref:"Comment",
 }
],
	likes:[
		{
			 	type:Schema.Types.ObjectId,
	  	ref:"User",
		}
		],
	dislikes:[
		{
			 	type:Schema.Types.ObjectId,
	  	ref:"User",
		}
		],
},{timestamps:true})


const Post = new model('Post', postSchema)

module.exports = Post