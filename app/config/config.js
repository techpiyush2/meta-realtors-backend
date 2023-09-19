"use strict";

const config = {
  local: {
    port: 5000,
    env: "prod",
    email_port: 465,
    db: {
      user: "META",
      password: "REALTOTS",
      url : "mongodb+srv://cluster0.vtkshw9.mongodb.net/?retryWrites=true&w=majority"
    },

  },
};

module.exports.get = function get(env) {
  return config[env] || config.default;
};
