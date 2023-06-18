const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Mongo DB
const mongoose = require("mongoose");
const mongodb = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:${process.env.MONGO_PORT}`;

mongoose
  .connect(mongodb)
  .then(() => {
    console.log("mongo connected");
  })
  .catch((error) => {
    console.error("Failure: Unconnected.");
    console.error(error);
  });

const Schema = mongoose.Schema;
const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String,
});
const BlogModel = mongoose.model("Blog", BlogSchema);

// router

app.get("/", async (req, res) => {
  const allBlogs = await BlogModel.find();
  console.log(allBlogs);
  res.render("index", { allBlogs });
});

app.get("/blog/:id", async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  console.log(singleBlog);
  res.render("blogRead", { singleBlog });
});

app.get("/blog/update/:id", async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  console.log(singleBlog);
  res.send("kobetu");
});

app.post("/blog/update/:id", (req, res) => {
  BlogModel.updateOne({ _id: req.params.id }, req.body)
    .then((savedBlogData) => {
      console.log("success.");
      res.send("saved.");
    })
    .catch((err) => {
      console.log("failed data write.");
      res.send("faied.");
    });
});

app.get("/blog/create", (req, res) => {
  res.sendFile(__dirname + "/views/blogCreate.html");
});

app.post("/blog/create", (req, res) => {
  console.log(req.body);

  //NOTE:
  // mongooseのversion upによりcallbackでの書き方に変更.
  // https://stackoverflow.com/questions/75701761/mongooseerror-model-create-no-longer-accepts-a-callback

  BlogModel.create(req.body)
    .then((savedBlogData) => {
      console.log("success.");
      res.send("saved.");
    })
    .catch((err) => {
      console.log("failed data write.");
      res.send("faied.");
    });
});

app.get("/blog/delete/:id", async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  console.log(singleBlog);
  res.send("kobetu");
});

app.post("/blog/delete/:id", (req, res) => {
  BlogModel.deleteOne({ _id: req.params.id }, req.body)
    .then((savedBlogData) => {
      console.log("success.");
      res.send("deleted.");
    })
    .catch((err) => {
      console.log("failed data delete.");
      res.send("faied.");
    });
});

app.listen(5000, () => {
  console.log("Listening on localhost port 5000.");
});
