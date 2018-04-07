var express = require("express");
var router = express.Router({mergeParams: true});
var Profile = require("../models/profile");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
   Profile.findById(req.params.id, function(err, profile){
       if (err) {
           console.log(err)
       } else {
         res.render("comments/new", {profile: profile});  
       }
   })
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup camground by id
   Profile.findById(req.params.id, function(err, profile) {
      if(err) {
          console.log(err);
          res.redirect("/profile");
      } else {
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  req.flash("error", "Whoops! Something went wrong");
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  profile.comments.push(comment);
                  profile.save();
                  req.flash("success", "Successfully added comment");
                  res.redirect('/profiles/' + profile._id);
              }
          });
      }
   });
});

// EDIT Comments Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {profile_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE Comments Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/profiles/" + req.params.id);
      }
   });
});

// DESTROY Comments Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {          
            req.flash("success", "Comment deleted");
            res.redirect("/profiles/" + req.params.id);
        }
    });
});


module.exports = router;