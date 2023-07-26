"use strict";

const mongoose = require('mongoose')

const industryFeatureSchema = new mongoose.Schema( {
    title : {
        type:String,
        default: null
    },
    industryId :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Industries"
    },
    isActive : {
        type:Boolean,
        default:true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},
  {
    timestamps: true,
  })

const IndustryFeature = mongoose.model('indusFeature',industryFeatureSchema);
module.exports = IndustryFeature