"use strict";

const config = require("./config").get(process.env.NODE_ENV);
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, {
  user: config.db.user,
  pass: config.db.password,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection failed"));
db.once("open", function () {
  console.log("Database conencted successfully!");
});
