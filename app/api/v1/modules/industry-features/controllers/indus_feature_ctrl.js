"use strict";

const { Response, internalError } = require("../../../../../lib/response")
const  commonQuery = require("../../../../../lib/common_query")
const { indsFeatureValidation } = require("./../../../../../lib/joiSchema"),
catchAsync = require("../../../../../lib/catchAsync"),
toggleStatus = require("../../factory/changeStatus"),
constants = require("../../../../../lib/constants"),
softDelete = require("../../factory/softDelete"),
indusFeature = require("../models/indus_feature_model")







exports.addFeature = catchAsync( async(req , res)=>{

    let insertObj = { title : req.body.title , industryId :req.body.industryId } 

    await indsFeatureValidation.validateAsync(insertObj)

    let response = await indusFeature.create(insertObj)

    if (response){
        return res.json(
            Response(constants.statusCode.ok, constants.messages.addedSuccess,response)
          );
    }else{
        return res.json(
            Response(constants.statusCode.unauth, constants.messages.internalservererror)
          );
    }
   
})
