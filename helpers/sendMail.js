const nodemailer = require('nodemailer')
const config = require('config')

const { SMTP_EMAIL, SMTP_PASSWORD } = config.get('nodemailer')


module.exports =  ({title, body, emailReciever})=>{
const msg = {
	from: SMTP_EMAIL,
	to:emailReciever,
	subject:title,
	text:body,
}
nodemailer.createTransport({
	service:'gmail',
	auth:{
		user: SMTP_EMAIL,
		pass: SMTP_PASSWORD,
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
