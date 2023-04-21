const User = require('./User');
const Post = require('./post/Post');
const Comment = require('./post/Comment');
const addSourceName = require('../helpers/notification/addSourceName');
const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: String,
      enum: [
        'like',
        'comment',
        'reply',
        'friendRequest',
        'acceptFriendRequest',
        'story',
        'follow',
        'custom',
      ],
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    source: {
      sourceId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'source.referance',
      },
      referance: {
        type: String,
        required: true,
      },
    },
  },
  //expire this document after 7 days
  { timestamps: true, expireAfterSeconds: 604800 }
);

//pre save hook to add text to notification document based on event type and source referance
notificationSchema.pre('save', async function () {
  //get user name of sender to add to notification text.
  const user = await User.findOne({ _id: this.sender });
  //add text to notification document based on event type
  switch (this.event.toUpperCase()) {
    case 'LIKE':
      this.text = `${user.name} liked your ${addSourceName(
        this.source.referance
      )}`;

      break;
    case 'COMMENT':
      this.text = `${user.name} commented on your post`;
      break;
    case 'REPLY':
      this.text = `${user.name} replied to your comment`;
      break;
    case 'FRIENDREQUEST':
      this.text = `${user.name} send you a friend request`;
      break;

    case 'ACCEPTFRIENDREQUEST':
      this.text = `${user.name} accepted your friend request`;
      break;

    case 'FOLLOW':
      this.text = `${user.name} started following you`;
      break;
  }
});

const Notification = new model('Notification', notificationSchema);

module.exports = Notification;
