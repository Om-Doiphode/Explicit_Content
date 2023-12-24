require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
app.use(cors());
const connectDB = require("./db/conn");

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use("/auth", require("./routes/auth"));

app.listen(3001, function () {
    console.log("Server started at port 3001");
  });