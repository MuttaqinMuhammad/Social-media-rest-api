/*
Description: This module exports an arry of middlewares. app.use can take an array as an argument . app.JS imports this array and use this array with app.use(Array).
*/

const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const config = require('config')
const path = require('path')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')

const COOKIE_SECRET_KEY = config.get('COOKIE_SECRET_KEY')
require('../helpers/googleAuth')

module.exports = [
  express.json(),
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }),
  cors(),
  passport.initialize(),
  passport.session(),
  morgan('dev'),
  express.urlencoded({ extended: true }),
  cookieParser(COOKIE_SECRET_KEY),
  express.static(path.join(__dirname, '../public'))
]
