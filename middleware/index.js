var Post = require("../models/post");
var path = require("path");
var multer = require("multer");
var middleware = {};

middleware.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){

        return next();
    }
    req.flash("error","You need to login first");
    res.redirect("/login");
}


middleware.isAuthorized = (req,res,next)=>{
    if(req.isAuthenticated()){
        Post.findById(req.params.id,(err,post)=>{
            if(err){
                req.flash("Sorry! This post doesn't exist");
                req.redirect("back");
            }
            else{
                if(post.author._id.equals(req.user._id)){
                    return next();
                }else{
                    req.flash("error","You are not authorised to do that!");
                    res.redirect("/post");
                }
            }
        });
    }else{
        req.flash("error","You need to login first");
        res.redirect("/login");
    }
}


var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/uploads")
    },
    filename: (req,file,cb)=>{
        var ext = path.extname(file.originalname)
        cb(null,Date.now()+ext)
    }
})


middleware.upload = multer({
    storage: storage,
    fileFilter: (req,file,callback)=>{
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg"
        ){
            callback(null,true)
        }else{
            console.log("File should be image..!");
            callback(null,false);
        }
    },
    limits: {
        fileSize: 1024 *1024 *10
    }
})


module.exports = middleware ;