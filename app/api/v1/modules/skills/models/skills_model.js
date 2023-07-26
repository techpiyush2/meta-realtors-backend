'use strict'

const mongoose = require('mongoose')

const skillsSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    // description: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    type: { type : String, default : null },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillsSchema)
module.exports = Skill
