"use strict";

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    image: { type: String, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "blogcategories" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    metaDescription : { type : String , default :null },
    permalink : { type : String , default :null },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    type : {  type : String , enum : ['App','Web','digital','Marketing','Technologies']}
  },
  {
    timestamps: true,
  }
);

// app, web, digital, marketing, technologies,

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;