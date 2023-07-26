"use strict";

const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    // title: { type: String, default: null },
    name: { type: String, default: null },
    description: { type: String, default: null },
    image: { type: String, default: null },
    designation: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    type: { type: String, enum: ["IT", "ENGINEERING", "MEDICAL"] },
  },
  {
    timestamps: true,
  }
);

// ENGINEERING

// <option value="IT">ITSERVICES</option>

{/* <option value="ENGINEERING">ENGINEERING</option>

<option value="MEDICAL">MEDICAL</option> */}

const Testimonial = mongoose.model("testimonial-collection", testimonialSchema);
module.exports = Testimonial;
