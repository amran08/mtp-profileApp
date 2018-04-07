var mongoose    = require("mongoose"),
    Profile  = require("./models/profile"),
    Comment     = require("./models/comment");
    
var data = [
    {
        name: "Lightning Ridge",
        image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg",
        description: "Lorem ipsum dolor amet truffaut gastropub YOLO retro, distillery tofu put a bird on it keytar. Lo-fi shabby chic pok pok, migas 3 wolf moon scenester adaptogen artisan heirloom. Ugh vape palo santo, coloring book typewriter kombucha marfa beard prism truffaut pop-up brooklyn tofu kogi literally. Pork belly food truck dreamcatcher coloring book tofu YOLO palo santo."
    },
    {
        name: "Diggers Rest",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
        description: "Lorem ipsum dolor amet truffaut gastropub YOLO retro, distillery tofu put a bird on it keytar. Lo-fi shabby chic pok pok, migas 3 wolf moon scenester adaptogen artisan heirloom. Ugh vape palo santo, coloring book typewriter kombucha marfa beard prism truffaut pop-up brooklyn tofu kogi literally. Pork belly food truck dreamcatcher coloring book tofu YOLO palo santo."
    },    
    {
        name: "Mount Awesome",
        image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
        description: "Lorem ipsum dolor amet truffaut gastropub YOLO retro, distillery tofu put a bird on it keytar. Lo-fi shabby chic pok pok, migas 3 wolf moon scenester adaptogen artisan heirloom. Ugh vape palo santo, coloring book typewriter kombucha marfa beard prism truffaut pop-up brooklyn tofu kogi literally. Pork belly food truck dreamcatcher coloring book tofu YOLO palo santo."
    }
]
    
function seedDB(){
    // Remove all profiles
    Profile.remove({}, function(err){
        if (err){
            console.log(err);
        }
        console.log("REMOVED PROFILES");
        // Add in profiles
        data.forEach(function (seed) {
          Profile.create(seed, function(err, profile){
                  if (err){
                      console.log(err);
                  } else {
                      console.log("ADDED A PROFILE");
                      // CREATE A COMMENT
                      Comment.create(
                          {
                              text: "This profile is great but I wish there was WIFI",
                              author: "Homer"
                          }, function(err, comment){
                              if (err){
                                  console.log(err)
                              } else{
                                 profile.comments.push(comment);
                                profile.save(); 
                                console.log("Created a comment");
                              }
                          });
                  }
            });  
        });
    });
    // Add a few comments
};

module.exports = seedDB;