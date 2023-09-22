"use strict";

const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    mobileNo: { type: Number, default: null },
    email: { type: String, default: null },
    message: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

//

const Contactus = mongoose.model("Contactus", contactusSchema);
module.exports = Contactus;
