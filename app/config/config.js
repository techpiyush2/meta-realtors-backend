"use strict";

const config = {
  local: {
    port: 4000,
    env: "prod",
    email_port: 465,
    db: {
      user: "meta",
      password: "realtors",
      url: "mongodb://3.15.104.11:27017/",
      url : "mongodb+srv://cluster0.rt9q9f1.mongodb.net/?retryWrites=true&w=majority"
    },
    // baseUrl: "https://zimo.one/",
    // siteURL: "https://zimo.one/",
    // imageBaseUrl: "https://zimo.one",
    // backendBaseUrl: "https://zimo.one",
    smtp: {
      service: "Outlook365",
      username: "info@zimo.one",
      password: "India@2022@",
      host: "smtp.office365.com",
      mailUserName: "info@zimo.one",
      verificationMail: "",
    },
  },
};

module.exports.get = function get(env) {
  return config[env] || config.default;
};
