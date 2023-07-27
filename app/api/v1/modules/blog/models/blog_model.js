"use strict";

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    metaDescription : { type : String , default :null },
    type : {  type : String , enum : ['PLOT','FLAT','VILLA','KOTHI']}
  },
  {
    timestamps: true,
  }
);

// app, web, digital, marketing, technologies,

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;