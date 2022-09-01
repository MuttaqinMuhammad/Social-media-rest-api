const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

module.exports = [
	express.json(),
	morgan('dev'),
	express.urlencoded({extended:true}),
	cookieParser(process.env.COOKIE_SECRET_KEY),
]