const nodemailer = require('nodemailer')

module.exports =  (title, body, reciver)=>{
const msg = {
	from:process.env.EMAIL_ID,
	to:reciver,
	subject:title,
	text:body,
}
nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:process.env.EMAIL_ID,
		pass:process.env.EMAIL_PASSWORD,
	},
	port:465,
	host: "smtp@gmail.com",
	
}).sendMail(msg, (err)=>{
	if (err) {
  return false
	}

})
  return true  
  }
