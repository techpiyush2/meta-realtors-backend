"use strict";

const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    content: { type: String, default: null },
    img: { type: String, default: null },
    technology: { type: String, default: null },
    shortTitle : {type :String ,default :null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    displayOrder:{type:Number,default:0},
    type : { type : String , default : null }
  },
  {
    timestamps: true,
  }
);

const Services = mongoose.model("Services", servicesSchema);
module.exports = Services;
