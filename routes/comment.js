var express = require("express");
var router = express.Router({mergeParams:true});
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Add Comment
router.post("/",middleware.isLoggedIn,(req,res)=>{
    req.body.text = req.sanitize(req.body.text);
    var newComment = {
        text: req.body.text,
        author: {
            name: req.user.username,
            id: req.user.id
        }
    };
    Post.findById(req.params.id,(err,post)=>{
        if(err){
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("/post");
        }
        
        else{
            Comment.create(newComment,(err,comment)=>{
                if(err){
                    console.log(err);
                    req.flash("error","Something went wrong");
                    res.redirect("/post/"+req.params.id);
                } else {
                    post.comments.push(comment);
                    post.save((err,data)=>{
                        if(err){
                            console.log(err);
                            req.flash("error","Something went wrong");
                        }
                        else{
                            console.log("New comment added");
                            req.flash("success","Comment added succesfully");
                        }
                        res.redirect("/post/"+req.params.id);
                    })
                }
            })
        }
    })
});





module.exports = router;