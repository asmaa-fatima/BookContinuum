const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const HttpError = require('../models/errorModel');
const io = require('../index').io

//============================== CREATE COMMENT
//POST : api/comments/posts/:postId
//PROTECTED
const createComment = async (req, res, next) => {
    const { content } = req.body;
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
    if(!post) {
        return next(new HttpError("Post Not Found", 404))
    }

    const newComment = await Comment.create({
        content,
        creator: req.user.id,
        post: postId,
    });
    if(!newComment) {
        return next(new HttpError("Failed to create comment", 422))
    }

    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json(newComment);
    } catch (error) {
        return next(new HttpError("An error occured while creating the comment.", 500))
    }
};















//============================== GET COMMENTS BY POST
//GET : api/comments/post/:postId
//UNPROTECTED
const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('creator', 'name avatar'); // Populate creator with name and avatar
    res.status(200).json(comments);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//============================== GET SINGLE COMMENT
//GET : api/comments/:id
//UNPROTECTED
const getComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return next(new HttpError("Comment not found", 404));
        }
        res.status(200).json(comment);
    } catch (error) {
        return next(new HttpError(error));
    }
};

//============================== EDIT COMMENT
//PATCH : api/comments/:id
//PROTECTED
const editComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const { content } = req.body;
        let updatedComment
        if (!content) {
            return next(new HttpError("Content is required", 422));
        }
        const oldComment = await Comment.findById(commentId);
        if (!oldComment) {
            return next(new HttpError("Comment not found", 404));
        }

        if (req.user.id == oldComment.creator) {
            updatedComment = await Comment.findByIdAndUpdate(commentId, {content}, {new: true})

            if(!updatedComment){
                return next(new HttpError("Couldn't update comment",404))
            }

            const post = await Post.findById(oldComment.post)
            if(post) {
                const commentIndex = post.comments.findIndex(c => c.toString() ===commentId)
                if(commentIndex > -1){
                    post.comments[commentIndex] = updatedComment._id;
                    await post.save();
                }
            }
        } else {
            return next(new HttpError("You are not authorized to edit this comment", 403));
        }

        
        

        res.status(200).json(updatedComment);
    } catch (error) {
        return next(new HttpError(error));
    }
};

//============================== DELETE COMMENT
//DELETE : api/comments/:id
//PROTECTED
const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return next(new HttpError("Comment not found", 404));
        }

        // Check if the user is the creator of the comment
        if (req.user.id !== comment.creator.toString()) {
            return next(new HttpError("You are not authorized to delete this comment", 403));
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Remove the comment from the post's comments array
        await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });

        res.status(200).json({ message: `Comment ${commentId} deleted successfully` });
    } catch (error) {
        return next(new HttpError("Deleting comment failed", 500));
    }
};



//============================== LIKE COMMENT
//PATCH : api/comments/:id/like
//PROTECTED
const likeComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return next(new HttpError("Comment not found", 404));
        }
        if (comment.upvote.get(req.user._id.toString())) {
            comment.upvote.delete(req.user._id.toString());
        } else {
            comment.upvote.set(req.user._id.toString(), true);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        return next(new HttpError("Liking comment failed", 500));
    }
};




















//============================== GET COMMENTS BY USER
//GET : api/comments/user/:userId
//PROTECTED
const getCommentsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const comments = await Comment.find({ creator: userId }).sort({createdAt: -1})
        res.status(200).json(comments);
    } catch (error) {
        return next(new HttpError(error));
    }
};















module.exports = { createComment, getCommentsByPost, getComment, editComment, deleteComment, likeComment, getCommentsByUser };