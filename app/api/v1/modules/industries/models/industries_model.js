"use strict";

const mongoose = require("mongoose");

const industriesSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    type : { type : String , default : null },
    display : { type : Number , default : null }
  },
  {
    timestamps: true,
  }
);

const Industries = mongoose.model("Industries", industriesSchema);
module.exports = Industries;
