"use strict";

const mongoose = require("mongoose"),
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

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

usersSchema.pre('save', async function (next) {
  // check weather thhe password is modified or not
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR)
  next()
})

usersSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
