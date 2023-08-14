"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection failed"));
db.once("open", function () {
  console.log("Database conencted successfully!");
});
