var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
const { populate } = require("../models/user");


// Home
router.get("/",(req,res)=>{
    res.redirect("/post");
});


// SignUp form
router.get("/register",(req,res)=>{
    res.render("auth/register");
});

// SignUp Logic
router.post("/register",(req,res)=>{
    var newUser = {
        username : req.body.username
    };
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome "+req.user.username);
            res.redirect("/post");
        });
    });
});

// Login form
router.get("/login",(req,res)=>{
    res.render("auth/login")
})

// Login Logic
router.post("/login",passport.authenticate("local",{
    successFlash: "Succesfully Loged in",
    successRedirect: "/post",
    failureFlash: "Invalid username or password",
    failureRedirect: "/login"
}),(req,res)=>{});

// Logout 
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success","Loged out");
    res.redirect("/post");
})

router.get("/profile",middleware.isLoggedIn,(req,res)=>{
    
    User.findById(req.user.id).populate("posts").populate("comments").exec((err,user)=>{
        if(err)
        console.log(err);
        else 
        res.render("auth/profile",{user:user});
    })

})

module.exports = router;