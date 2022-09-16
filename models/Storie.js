const { Schema, model } = require('mongoose')


const storySchema = new Schema({
  creator:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  image:{
    secureURL:{
      type:String,
      required:true
    },
    publicId:{
      type:String,
      required:true,
    },
  },
  privicy:{
    type:String,
    enum:['public', 'friends'],
  },
    likes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
}],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
message:{
  type:String,
  trim:true,
}
},{timestamps:true})


const Story = new model("Storie", storySchema)

module.exports = Story