"use strict";

module.exports = (app) => {
  

  const mongoose = require("mongoose");

  // ***************  Starting Node Server  ***********************
  const port = process.env.PORT || 5000 ;
  const server = app.listen(port, () => {
    console.log(`listening to the port ${port} ...`);
  });

  // Unhandled requests
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDELED REJECTION !!  Shuting Down...");
    console.log(err);
    server.close(() => {
      process.exit(1);
    });
  });

  // ***************  Database Connection  *************************
  const DB = process.env.DB_USER.replace(
    "<PASSWORD>",
    process.env.DB_PASS
  );

  // mongoose.Promise = global.Promise
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection failed"));

  db.once("open", function () {
    console.log("DB connected successfully");
  });
};
