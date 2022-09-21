/*
Description: This module exports an arry of middlewares. app.use can take an array as an argument . app.JS imports this array and use this array with app.use(Array).
*/

const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const config = require('config')
const path = require('path')

const COOKIE_SECRET_KEY = config.get('COOKIE_SECRET_KEY')

module.exports = [
  express.json(),
  morgan('dev'),
  express.urlencoded({ extended: true }),
  cookieParser(COOKIE_SECRET_KEY),
  express.static(path.join(__dirname, '../public'))
]
