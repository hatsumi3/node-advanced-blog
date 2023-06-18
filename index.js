const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello.");
});

app.get("/blog/create", (req, res) => {
  res.sendFile(__dirname + "/views/blogCreate.html");
});

app.post("/blog/create", (req, res) => {
  console.log(req.body);
  res.send("saved.");
});

app.listen(5000, () => {
  console.log("Listening on localhost port 5000.");
});
