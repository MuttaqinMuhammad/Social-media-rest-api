const router = require('express').Router()
const Post = require('../models/Post')
router.get('/', (req, res)=>res.json({msg:"hi"}))

module.exports = router 