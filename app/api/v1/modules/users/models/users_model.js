"use strict";

const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    // firstName: { type: String, default: null },
    // lastName: { type: String, default: null },
    // pincode: { type: String, default: null },
    // state: { type: String, default: null },
    // country: { type: String, default: null },
    image: { type: String, default: null },
    // address: { type: String, default: null },
    // userName: { type: String, default: null },
    password: { type: String, default: null },
    resetkey : { type:String ,default : null },
    email: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
