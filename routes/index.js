var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
const sgMail = require('@sendgrid/mail');
var async = require('async')
var crypto = require('crypto');
//LANDING PAGE
router.get("/", function(req, res){
   res.render("landing"); 
});


// =================== 
// AUTH ROUTES 
// ===================

// Show register form 
router.get("/register", function(req, res){
    res.render("register");
});

// Show terms page
router.get("/terms", function(req, res) {
   res.render("terms"); 
});

// Show terms page
router.get("/privacy", function(req, res) {
   res.render("privacy"); 
});

// Handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err, user){
       
        if (err) {
            req.flash("error", err.message);
            //console.log(err.message)
            return res.render("register");
          }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to MeetThePeople " + user.username);
            res.redirect("profiles");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    req.flash("success", "You are logged in");
    res.render("login");
}); 

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/profiles", 
        failureRedirect: "/login"
    }), function(req, res) {
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/profiles");
});

router.get('/forgot', function(req, res) {
    res.render('forgot', {
      username: req.username
    });
  });

  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
          console.log("Asdasasas")
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user
      });
    });
  });

  router.post('/reset/:token', function(req, res) {
      console.log("amraasasas")
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save(function(err) {
            console.log("Updated password for"+User.username)
          });
        });
      },

    ], function(err) {
      res.redirect('/');
    });
  });
  //login forgot 
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ username: req.body.username }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
       
        sgMail.setApiKey('');
        const msg = {
          to: user.username,
          from: 'itech0805117@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
       if(sgMail.send(msg)) {
          req.flash('info', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
          done('done');
        }
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  }); 


  
  
module.exports = router;
