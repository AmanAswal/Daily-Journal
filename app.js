//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to 100 days of code!";
const aboutContent = "About page!";
const contactContent = "Contact Us!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
 };

const Post = mongoose.model("Post", postSchema); 

let posts = [];


app.get("/", (req,res) =>{
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
 
  });
});


app.get("/compose", (req,res) =>{
  res.render("compose");
});

app.post("/compose", (req, res) =>{
  
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});



app.get("/posts/:postId", function (req, res) {
  
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});



app.get("/about", (req,res) =>{
  res.render("about", {aboutUs: aboutContent});
});

app.get("/contact", (req,res) =>{
  res.render("contact", {contactUs: contactContent});
});


app.listen(4000, function() {
  console.log("Server started on port 4000");
});
