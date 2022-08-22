var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Post",postSchema);