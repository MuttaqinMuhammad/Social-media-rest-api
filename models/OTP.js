const { Schema, model } = require('mongoose')

const otpSchema = new Schema({
	
	otp:{
		type:String,
		required:true,
		trim:true,
	},
	email:{
		type:String,
		required:true,
		trim:true,
},
  isValid:{
  	type:Boolean,
  	default:false
  }
	

}, {timestamps:true})

const Otp = new model('otp',otpSchema)

module.exports = Otp;


