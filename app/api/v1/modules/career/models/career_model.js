"use strict";

const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    skill: [{ type: String, default: null }],
    description: { type: String, default: null },
    job_title: { type: String, default: null },
    //  img: { type: String, default: null },
    location: { type: String, default: null },
    jobType:{type : String , default:null},
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    type: { type: String , default : null },
  },
  {
    timestamps: true,
  }
);

const Career = mongoose.model("Career", careerSchema);
module.exports = Career;
