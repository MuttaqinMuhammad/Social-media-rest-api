//external import
const express = require('express')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
// internal imports
const userRoute = require('./routes/userRoute')

const app = express()
dotenv.config()


const middlewares = [
	express.json(),
	morgan('dev'),
	express.urlencoded({extended:true}),
	cookieParser(),
]
app.use(middlewares)

app.use('/user', userRoute)




module.exports = app
