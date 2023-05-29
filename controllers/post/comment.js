const Comment = require('../../models/post/Comment');
const Post = require('../../models/post/Post');
const Reply = require('../../models/post/Replie');

/*
Description: this function takes a  post id and add a comment on the post.takes the comment from req.body.
*/
const createComment = async (req, res, next) => {
  const { postId } = req.params;
  const user = req.user._id;

  try {
    //searching the post.
    const post = await Post.findOne({ _id: postId });
    //checking the post if the post doesnt exist throw a Error.
    if (!post) throw new Error('no post exist to comment!');

    const comment = new Comment({
      //creating comment
      body: req.body.body,
      user,
      postId,
    });

    const userComment = await comment.save(); //saving the comment
    //pushing the comment id inside the post (comments Array). and  populating all comments
    const updatedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: {
          comments: userComment._id,
        },
      },
      {
        new: true,
      }
    ).populate('comments');

    //if the  post author comments  his post. and the post have other commentators. then all the other commentators will be notified that " (author name) also commented on his post"

    /*
Function name: notifyAllCommentators
Description: this Function takes the post and the post auther .after that this Function finds all the commentators and create a Notification for each of them.
*/
    //checking if the user is  the  post author
    if (userComment.user.toString() === updatedPost.user.toString()) {
      //notifing all the other commentators.
      await notifyAllCommentators(req.user, updatedPost);
      return res.status(200).json({
        success: true,
        userComment,
      });
    }

    //i the comment creator is not the post author the .a single notification sended to the post author that " (commentator name) commented on your post "
    const notification = await Notification.create({
      sender: req.user._id,
      reciever: post.user,
      event: 'comment',
      source: {
        sourceId: postId,
        referance: 'Post',
      },
    });
    //emit the socket event
    global.io.emit('Notification', notification);
    res.status(200).json({
      success: true,
      userComment,
    });
  } catch (e) {
    next(e);
  }
};

/*
Description: this Function thakes the comment id from req.params and the comment body from req.body. if the user id matches the comment creator id then this Function edits the comment. 
*/

const editComment = async (req, res, next) => {
  const { commentId } = req.params;
  const user = req.user._id;

  try {
    //finds the comment
    const comment = await Comment.findOne({
      _id: commentId,
      user,
    });
    //checks if the comment exist
    if (comment) {
      //updating the comment
      await Comment.updateOne(
        {
          _id: commentId,
        },
        {
          $set: {
            body: req.body.body,
          },
        }
      );
    } else {
      throw new Error('only the creator can edit his comment');
    }
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

/*
Description: this Function takes the commentId and deletes that.
*/
const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    //searching the comment.
    const comment = await Comment.findOne({
      _id: commentId,
      user: req.user._id,
    });
    //checking if the comment exist. otherwise throw error
    if (comment) {
      await Comment.deleteOne({
        //deleting the comment
        _id: commentId,
        user: req.user._id,
      });
      await Post.updateOne(
        {
          _id: comment.postId, //removing the comment id from the post
        },
        {
          $pull: {
            comments: comment._id,
          },
        }
      );
      await Reply.deleteMany({ _id: { $in: comment.replies } }); //deleting all the replies.

      res.status(200).json({
        success: true,
        error: false,
      });
    }

    throw new Error('no comment found');
  } catch (e) {
    next(e);
  }
};

/*
Description: this Function likes a comment .if the user already liked the comment then like is removed
*/
const like = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const user = req.user._id;
    //searching the comment
    const comment = await Comment.findOne({
      _id: commentId,
    });
    if (!comment) throw new Error('no comment exist!');
    //checking if the user already disliked the Function.if the user already disliked the comment the the dislike will be removed .
    if (comment.dislikes.includes(user)) {
      await Comment.updateOne(
        {
          _id: commentId,
        },
        {
          $pull: {
            dislikes: user,
          },
        }
      );
    } else if (comment.likes.includes(user)) {
      //if the user already liked the post then the like will be removed.
      await Comment.updateOne(
        {
          _id: commentId,
        },
        {
          $pull: {
            likes: user,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: 'like removed',
      });
    }
    // finally pushing the user id inside (likes Array) of comment.
    await Comment.updateOne(
      {
        _id: commentId,
      },
      {
        $push: {
          likes: user,
        },
      }
    );

    //notifing the post auther that (user name) liked your comment.
    if (comment.user.toString() !== user.toString()) {
      const notification = await Notification.create({
        sender: user,
        reciever: comment.user,
        event: 'like',
        source: {
          sourceId: comment._id,
          referance: 'Comment',
        },
      });
      global.io.emit('Notification', notification);
    }
    res.status(200).json({
      success: true,
    });
  } catch {
    const error = new Error();
    error.message = 'there was a server side error';
    next(error);
  }
};

/*
Description: this Function dislikes a comment .if the user already disliked the comment then dislike is removed
*/
const dislike = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const user = req.user._id;
    //searching the comment.
    const comment = await Comment.findOne({
      _id: commentId,
    });
    if (!comment) throw new Error('no comment exist!');
    //checking if the user have liked the comment .if liked then the like will be removed.
    if (comment.likes.includes(user)) {
      await Comment.updateOne(
        {
          _id: commentId,
        },
        {
          $pull: {
            likes: user,
          },
        }
      );
    } else if (comment.dislikes.includes(user)) {
      //checking if the user already dislike the post if disliked the dislike will be removed.
      await Comment.updateOne(
        {
          _id: commentId,
        },
        {
          $pull: {
            dislikes: user,
          },
        }
      );

      return res.status(200).json({
        success: true,
      });
    }

    //finally pushing the dislike inside the comment(dislikes Array).
    await Comment.updateOne(
      {
        _id: commentId,
      },
      {
        $push: {
          dislikes: user,
        },
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch {
    const error = new Error();
    error.message = 'there was a server side error';
    next(error);
  }
};

//exporting all the functions
module.exports = {
  createComment,
  editComment,
  deleteComment,
  like,
  dislike,
};
