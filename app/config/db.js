"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://META:REALTOTS@cluster0.vtkshw9.mongodb.net/?retryWrites=true&w=majority', {
  pass: process.env.DB_PASS,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection failed"));
db.once("open", function () {
  console.log("Database conencted successfully!");
});
