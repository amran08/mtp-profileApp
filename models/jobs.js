var mongoose    = require("mongoose");

var jobSchema = new mongoose.Schema({
   jobVenueName: String,
   jobDesc: String,
   jobRole: String,
   jobLocation: String,
   jobCountry: String,
   jobContactName: String, 
   jobContactPhone: String, 
   jobContactEmail: String,
   jobStartDate: String,
   jobAuthor: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("jobs", jobSchema);
