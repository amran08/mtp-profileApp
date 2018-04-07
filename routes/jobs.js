var express = require("express");
var router = express.Router();
var Jobs = require("../models/jobs");
var middleware = require("../middleware");

//INDEX Route
router.get("/", function(req, res){
    // Get all Jobs from DB
    Jobs.find({}, function(err, allJobs){
        if (err){
            console.log(err);
        } else {
            res.render("jobs/joblist", {jobs: allJobs});
        }
    });
});

// CREATE new job route
router.post("/", middleware.isLoggedIn, function(req, res){
   var jobVenueName = req.body.jobVenueName;
   var jobDesc = req.body.jobDescription;
   var jobRole = req.body.jobRole;
   var jobStartDate = req.body.jobStartDate;
   var jobLocation = req.body.jobLocation;
   var jobCountry = req.body.jobCountry;
   var jobContactName = req.body.jobContactName;
   var jobContactPhone = req.body.jobContactPhone;
   var jobContactEmail = req.body.jobContactEmail;
   var jobAuthor = {
       id: req.user._id,
       username: req.user.username
   }
   var newJob = {jobVenueName: jobVenueName, jobDesc: jobDesc, jobRole: jobRole, jobStartDate: jobStartDate, jobLocation: jobLocation, jobCountry: jobCountry, jobAuthor: jobAuthor, jobContactName: jobContactName, jobContactPhone: jobContactPhone, jobContactEmail: jobContactEmail}
   //Create a new job and save to DB
   Jobs.create(newJob, function(err, newlyCreatedJob){
       if(err){
           console.log(err);
       } else {
           // Redirect back to jobs
           console.log(newlyCreatedJob);
            res.redirect("/jobs");
       }
   });
});

// NEW Route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("jobs/postjob");
});

//SHOW a job by ID
router.get("/:id", function(req, res) {
    //find the job with provided id
    Jobs.findById(req.params.id).exec(function(err, foundJob){
       if (err){
           console.log(err);
       } else {
           console.log(foundJob);
        //render show template with that job
        res.render("jobs/showjob", {jobs: foundJob});
       };
    });
});

// EDIT Job route
router.get("/:id/edit", middleware.checkJobOwnership, function(req, res) {
    Jobs.findById(req.params.id, function(err, foundJob){
        if (err) {
            res.redirect("/jobs");
        } else {
        res.render("jobs/editjob", {jobs: foundJob});
        };
    });
});

// UPDATE Job route
router.put("/:id", middleware.checkJobOwnership, function(req, res){
    Jobs.findByIdAndUpdate(req.params.id, req.body.jobs, function(err, updatedJob){
        if (err){
            res.redirect("/jobs");
        } else {
            res.redirect("/jobs/" + req.params.id);
        }
    });
});

// DESTROY Job Route
router.delete("/:id", middleware.checkJobOwnership, function(req, res){
   Jobs.findByIdAndRemove(req.params.id, function(err){
      if (err){
          res.redirect("/jobs");
      } else {
        res.redirect("/jobs");
      }
   }); 
});

module.exports= router;