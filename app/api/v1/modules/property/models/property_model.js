"use strict";

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    description: { type: String, default: null },
    images: { type: Array, default: [] },
    type: { type: String, enum: ["PLOT", "FLAT", "VILLA", "KOTHI","COMMERCIAL"] },
    bedrooms: { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    size: { type: Number, default: null },
    price: { type: Number, default: null },
    parking: { type: Boolean, default: false },
    parkOrGarden: { type: Boolean, default: false },
    Features: { type: Array, default: [] },
    address: { type: String, default: null },
    contactNo: { type: Number, default: null },
    ownerName: { type: String, default: null },
    approved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Technology = mongoose.model("property", propertySchema);
module.exports = Technology;
  