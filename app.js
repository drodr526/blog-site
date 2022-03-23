//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { result } = require("lodash");

mongoose.connect('mongodb://localhost:27017/blogdb');
mongoose.set('setDefaultsOnInsert', true);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = new mongoose.Schema({
  title:String,
  title_lowercase:{
    type:String,
    default:function()
    {
      return _.lowerCase(this.title)
    }
  },
  content:String
});

const Post = new mongoose.model("post",postSchema);

const post1 = new Post({
  title:"Another Post",
  content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
})

const post2 = new Post({
  title:"Day 1",
  content:"Ut consequat semper viverra nam libero justo. In cursus turpis massa tincidunt. Ultricies mi quis hendrerit dolor magna eget est lorem. Eu facilisis sed odio morbi quis commodo odio aenean sed. Lorem dolor sed viverra ipsum nunc aliquet. At elementum eu facilisis sed odio morbi quis commodo odio. Euismod nisi porta lorem mollis aliquam ut porttitor leo. Scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis. Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Et egestas quis ipsum suspendisse. Fusce id velit ut tortor pretium. Ipsum consequat nisl vel pretium lectus quam id leo. Consectetur a erat nam at lectus urna. Vitae purus faucibus ornare suspendisse. Enim nulla aliquet porttitor lacus luctus accumsan tortor posuere. Augue interdum velit euismod in pellentesque massa placerat duis."
});

const post3 = new Post({
  title:"Day 2",
  content:"Scelerisque felis imperdiet proin fermentum leo vel orci. Feugiat nisl pretium fusce id velit ut tortor pretium viverra. Metus dictum at tempor commodo ullamcorper a. Convallis aenean et tortor at risus. Sit amet nisl purus in mollis. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc. Elit duis tristique sollicitudin nibh. Sed blandit libero volutpat sed cras ornare arcu. Viverra nibh cras pulvinar mattis nunc. Ac tortor vitae purus faucibus ornare. Enim sit amet venenatis urna cursus eget nunc scelerisque. Sed odio morbi quis commodo odio aenean. Ligula ullamcorper malesuada proin libero nunc. Morbi tincidunt augue interdum velit euismod in. Elementum tempus egestas sed sed risus pretium quam. Commodo quis imperdiet massa tincidunt nunc pulvinar. Eget duis at tellus at urna. Aliquet sagittis id consectetur purus ut faucibus. Morbi tristique senectus et netus."
});

Post.find({}, function(error,results)
{
  if (results.length == 0) {
    Post.insertMany([post1, post2, post3], function (error) {
      if (error) {
        console.log(error)
      }
      else {
        console.log("Added the default posts.");
      }
    });
  }
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res)
{
  Post.find({},function(error,results)
  {
    if(error)
    {
      console.log(error)
    }
    else
    {
      res.render("home.ejs",{content:homeStartingContent, postsArray:results});
    }
  });
});

app.get("/about",function(req,res)
{
  res.render("about.ejs",{content:aboutContent});
});

app.get("/contact",function(req,res)
{
  res.render("contact.ejs",{content:contactContent});
});

app.get("/compose",function(req,res)
{
  res.render("compose.ejs");
});

app.post("/compose",function(req,res)
{
  const postTitle = req.body.postTitle;
  const postContent = req.body.postContent;

  let post = new Post({
    title:postTitle,
    content:postContent
  });

  post.save()
  res.redirect("/");
});

app.get("/posts/:postTitle", function(req,res)
{
  const requestedTitle = _.lowerCase(req.params.postTitle);
  Post.findOne({title_lowercase:requestedTitle},function(error,foundPost)
  {
    if(error)
    {
      console.log(error)
    }
    else
    {
      if(foundPost)
      {
        console.log("Post found.")
        res.render("post.ejs",{title:foundPost.title,content:foundPost.content});
      }
    }
  });
  console.log("Post not found");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
