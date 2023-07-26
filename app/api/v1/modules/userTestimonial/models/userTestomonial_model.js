"use strict";

const mongoose = require("mongoose");

const userTestimonialSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
  description: { type: String, required: true },
  type: { type: String, enum: ["IT", "ENGINEERING", "MEDICAL"] },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

module.exports = new mongoose.model("userFeedback", userTestimonialSchema);