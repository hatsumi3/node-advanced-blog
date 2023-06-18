const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.send("hello.");
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

app.listen(5000, () => {
  console.log("Listening on localhost port 5000.");
});
