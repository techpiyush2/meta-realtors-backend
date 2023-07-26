"use strict";

const mongoose = require("mongoose");


const applicantSchema = new mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        default:null
    },
    contact:{
        type:String,
        default:null
    },
    expInYear:{
        type:Number,
        default:null
    },
    expInMonth:{
        type:Number,
        default:null
    },
    file:{
        type:String,
        default:null
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Career'    
    }
},{
  timestamps: true,
})

const Applicants = mongoose.model('Applicants',applicantSchema)
module.exports = Applicants