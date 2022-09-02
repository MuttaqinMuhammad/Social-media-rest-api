const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: 'dg6ok2heo', 
  api_key: '681964714382459', 
  api_secret: '1ULNSWu-pw5M2pKjvop-Y3G8yN0' 
});

module.exports = cloudinary