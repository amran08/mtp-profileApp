var express     = require("express"),
    app         = express(),
    multer = require('multer')
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    flash       = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    
    Profile  = require("./models/profile"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

// Requiring routes
var commentRoutes       = require("./routes/comments"),
    profileRoutes    = require("./routes/profiles"),
    indexRoutes          = require("./routes/index"),
    jobRoutes          = require("./routes/jobs");

    //put your mlab connection url here
var DB_CONNECTION_URL = '';
    mongoose.connect(DB_CONNECTION_URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
//seedDB();
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Taty is the cutest ever",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



app.use("/", indexRoutes);
app.use("/profiles", profileRoutes);
app.use("/profiles/:id/comments", commentRoutes);
app.use("/jobs", jobRoutes);



app.listen(process.env.PORT||3000, process.env.IP||'0.0.0.0', function(){
    console.log("The MTP Server Has Started!!!") 
 });