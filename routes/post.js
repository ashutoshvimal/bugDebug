var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");
var middleware = require("../middleware");



// All campground
router.get("/",(req,res)=>{
    Post.find({},(err,posts)=>{
        if(err)
        console.log("Something went wrong");
        else{
            res.render("post/post",{posts:posts});
        }
    })
})

// New Campground form
router.get("/add",middleware.isLoggedIn,(req,res)=>{
    res.render("post/Add");
})

// Create new Campground
router.post("/",middleware.isLoggedIn,middleware.upload.single("image"),(req,res)=>{
    req.body.content = req.sanitize(req.body.content);
    var newPost={
        title:req.body.title,
        content:req.body.content,
        author:req.user.id
    }
    if(req.file){
        newPost.image = req.file.path
    }
    console.log(req.file);
    Post.create(newPost,(err,posts)=>{
        if(err){
            console.log("Something went wrong");
            req.flash("error","Something went wrong");
            res.redirect("/post");
        }else{
            User.findById(req.user.id,(err,user)=>{
                if(err){
                    console.log("User not found");
                }else{
                    user.posts.push(posts);
                    user.save((err,data)=>{
                        if(err)
                        console.log(err);
                        else{
                            console.log("New post added by "+user);
                            req.flash("success","Post added successfully");
                            res.redirect("/post");
                        }
                    })
                }
            }) 
        }  
    });
});

// Show a post
router.get("/:id",(req,res)=>{
    Post.findById(req.params.id).populate("comments").populate("author").exec((err,post)=>{
        if(err)
        console.log(err);
        else{
            res.render("post/Show",{post:post});
        }  
    });
});


// Edit form
router.get("/:id/edit",middleware.isAuthorized,(req,res)=>{
    Post.findById(req.params.id,(err,post)=>{
        if(err)
        console.log(err);
        else{
            res.render("post/Edit",{post:post});
        }
    });
})

// Edit Logic
router.put("/:id",middleware.isAuthorized,middleware.upload.single("image"),(req,res)=>{
    req.body.content = req.sanitize(req.body.content);
    var newPost={
        title:req.body.title,
        content:req.body.content,
        author:req.user.id
    }
    if(req.file){
        newPost.image = req.file.path
    }else{
        newPost.image = null
    }
    Post.findByIdAndUpdate(req.params.id,newPost,(err,post)=>{
        if(err)
        console.log(err);
        else {
            req.flash("success","Pot updated succesfully");
            res.redirect("/post/"+req.params.id);
        }
        
    })
})


// Delete Campground
router.delete("/:id",middleware.isAuthorized,(req,res)=>{
    Post.findByIdAndRemove(req.params.id,(err,campground)=>{
        if(err)
        console.log(err);
        else{
            req.flash("success","Post deleted succesfully");
            res.redirect("/post");
        } 
    })
})



module.exports = router;