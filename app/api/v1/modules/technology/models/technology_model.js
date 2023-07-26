'use strict'

const mongoose = require('mongoose')

const technologySchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    description:{type:String, default:null},
    image : { type: String ,default:null},
    type : { type : String , default : null },
    display : {type : Number ,default : 0}
  },
  {
    timestamps: true,
  }
);

const Technology = mongoose.model('technology', technologySchema)
module.exports = Technology;



