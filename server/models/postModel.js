const {Schema, model} = require("mongoose")

const postSchema = new Schema({
    title: {type: String, required: true},
    category: {type: String, enum: ["Business", "Education", "Entertainment", "Art", "Uncategorized", "Fiction", "Non-Fiction", "Science Fiction", "Mystery", "Romance", "Thriller", "Horror", "History"], message: "VALUE is not supported"},
    description: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: "User", required:true},
    thumbnail: {type: String, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]

}, {timestamps: true})


module.exports = model("Post", postSchema)