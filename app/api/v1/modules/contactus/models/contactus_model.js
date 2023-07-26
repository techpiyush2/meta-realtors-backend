"use strict";

const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, default: null },
    contact: { type: String, default: null },
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
