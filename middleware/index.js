var Profile = require("../models/profile");
var Comment = require("../models/comment");
var Job = require("../models/jobs");

// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkProfileOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Profile.findById(req.params.id, function(err, foundProfile){
           if (err){
               req.flash("error", "Profile not found");
               res.redirect("back");
           } else {
               // does user own profile?
                if(foundProfile.author.id.equals(req.user._id)){
                  next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkJobOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Job.findById(req.params.id, function(err, foundJob){
           if (err){
               req.flash("error", "Job not found");
               res.redirect("back");
           } else {
               // does user own job?
                if(foundJob.jobAuthor.id.equals(req.user._id)){
                  next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if (err){
               res.redirect("back");
           } else {
               // does user own comment?
                if(foundComment.author.id.equals(req.user._id)){
                  next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
                }
            }
        });
    } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;