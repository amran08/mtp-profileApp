var express = require("express");
var router = express.Router();
var Profile = require("../models/profile");
var middleware = require("../middleware");
var path = require("path");
var AWS = require('aws-sdk')
var fs = require('fs')
AWS.config.loadFromPath('./aws-config.json');
var BucketName = "mtp-profiles-content"
var photoBucket = new AWS.S3({params: {Bucket: BucketName}})
var multer = require('multer')
const multerS3 = require('multer-s3');

const onFinished = require('on-finished');

var upload = multer({
    limits:{
        files:1
    },
    storage: multerS3({
        s3: photoBucket,
        bucket: BucketName,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            //editing profile 
            if(req.body.profile !== undefined)
            {
                Profile.findById(req.params.id,function(err, Profile){
                    var url = Profile.profileHeroImage
                    cb(null,url.split('/').slice(-1)[0])
                });  
            }
            //creating profile 
            else{
                cb(null, Date.now().toString())
            }
        }
    })
}).single('profileHeroImage') 

//INDEX Route
router.get("/", function(req, res){
    // Get all profiles from DB
    Profile.find({}, function(err, allProfiles){
        if (err){
            console.log(err);
        } else {
            res.render("profiles/index", {profiles: allProfiles});
        }
    });
});

// CREATE new profile route

router.post("/",upload,function(req, res,err_1){
    if(isFileExists(req)==false)
     {
        req.flash("error", "Please Choose a File");
        return res.redirect("back")
     }
    if (!/^image\/(jpe?g|png|gif)$/i.test(req.file.mimetype)) {
       
         req.flash("error", "Only Image file can be uploaded !!!");
         return res.redirect("back");
    }

    var name = req.body.name,
    userEmail = req.body.userEmail,
    desc = req.body.description,
    venue = req.body.venue,
    role = req.body.role,
    currentCity = req.body.currentCity,
    currentCountry = req.body.currentCountry,
    instaHandle = req.body.instaHandle,
    twitterHandle = req.body.twitterHandle,
    learnSkills = req.body.learnSkills,
    achievements = req.body.achievements,
    passionateAbout = req.body.passionateAbout,
    inspiration = req.body.inspiration,
    industryLove = req.body.industryLove,
    industryImprove = req.body.industryImprove,
    recommendsFirst = req.body.recommendsFirst,
    recommendsSecond = req.body.recommendsSecond,
    recommendsThird = req.body.recommendsThird,
    quote = req.body.quote,
    createdDate = Date(),
    author = {
   id: req.user._id,
   username: req.user.username
}
var newProfile = {name: name, userEmail: userEmail,description: desc, 
    createDate: createdDate, author:author, 
    venue:venue, quote: quote, role:role,
     currentCity:currentCity, currentCountry:currentCountry, instaHandle:instaHandle, 
     twitterHandle:twitterHandle, learnSkills:learnSkills, achievements:achievements,
     passionateAbout:passionateAbout, inspiration:inspiration, industryLove:industryLove,
     industryImprove:industryImprove, recommendsFirst:recommendsFirst, 
     recommendsSecond:recommendsSecond, recommendsThird:recommendsThird}
//Create a new profile and save to DB

Profile.create(newProfile, function(err, newlyCreated){
   if(err){
       console.log(err);
       req.flash("error", err.message);
       return res.redirect("back");
   } else {
        //update file's location to db
        Profile.findByIdAndUpdate(newlyCreated._id, { $set: { profileHeroImage: req.file.location }}, { new: true },function(err, updatedProfile){
            if(err){
                console.log(err);
                req.flash("error", err.message);
                return res.redirect("back");
            } else {
                
                console.log("updated file url in db");
            }
        });  
       // console.log(newlyCreated);
        res.redirect("/profiles");
   }
});

});

// NEW Route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("profiles/new");
});

//SHOW a profile by ID
router.get("/:id", function(req, res) {
    //find the profile with provided id
    Profile.findById(req.params.id).populate("comments").exec(function(err, foundProfile){
       if (err){
           console.log(err);
       } else {
           console.log(foundProfile);
        //render show template with that profile
        res.render("profiles/show", {profile: foundProfile});
       }
    });
});

// EDIT profile route
router.get("/:id/edit", middleware.checkProfileOwnership, function(req, res) {
    Profile.findById(req.params.id, function(err, foundProfile){
        res.render("profiles/edit", {profile: foundProfile});
    });
});


router.put("/:id",upload, middleware.checkProfileOwnership,function(req, res){
    Profile.findByIdAndUpdate(req.params.id, req.body.profile, function(err, updatedProfile){
        if (err){
            res.redirect("/profiles");
        } else {
            
            res.redirect("/profiles/" + req.params.id);
        }
    });
});

// DESTROY Profile Route
router.delete("/:id", middleware.checkProfileOwnership, function(req, res){
   Profile.findByIdAndRemove(req.params.id, function(err){
      if (err){
          res.redirect("/profiles");
      } else {
        res.redirect("/profiles");
      }
   }); 
});

function isFileExists(request){
    if(request.file)
    {
        return true 
    }
    else{
        return false
    }
}

module.exports= router;