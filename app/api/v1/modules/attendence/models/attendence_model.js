'use strict'

const mongoose = require('mongoose')

const attendenceSchema = new mongoose.Schema(
  {
    date : {type :String ,default: null },
    attendence : {type : Array ,default : null},
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);

const Attendence = mongoose.model("attendence", attendenceSchema);
module.exports = Attendence;



