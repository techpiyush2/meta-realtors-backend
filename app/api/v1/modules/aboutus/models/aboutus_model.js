'use strict'

const mongoose = require('mongoose')

const staticpageSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    description: { type: String, default: null },
    static:{type:String,default:true}
  },
  {
    timestamps: true,
  }
);

const Aboutus = mongoose.model("aboutus", staticpageSchema);
module.exports = Aboutus;



