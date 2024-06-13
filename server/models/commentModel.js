const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        upvote: {
            type: Map,
            of: Boolean
        }
    },
    { timestamps: true }
);

module.exports = model("Comment", commentSchema);