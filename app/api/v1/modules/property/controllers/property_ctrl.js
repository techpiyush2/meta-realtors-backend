﻿"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { propertyValidation } = require("../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Property = require("../models/property_model"),
  fs = require("fs"),
  uuid = require("uuid"),
  moment = require('moment');


exports.addProperty = catchAsync(async (req, res) => {
  let insertObj = {
    title: req.body.title,
    description:  req.body.description,
    images:  req.body.images,
    type:  req.body.type,
    bedrooms:  req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    size:  req.body.size,
    price:  req.body.price,
    parking:  req.body.parking,
    parkOrGarden:  req.body.parkOrGarden,
    Features:  req.body.Features,
    address: req.body.address,
    contactNo:  req.body.contactNo,
    ownerName:  req.body.ownerName,
  };

  const propertyExist = await Property.findOne({ title: req.body.title });

  if (propertyExist)
    return res.json(
      Response(constants.statusCode.unauth, constants.propertyMsg.exist)
    );

  await propertyValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;


  if (!createdby_id){
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );
  }
    

  insertObj.createdby_id = createdby_id;

  const finalResult = await Property.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.propertyMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.propertyList = catchAsync(async (req, res) => {
  const count = req.body.count ? req.body.count : constants.settings.count;
  req.body.page = req.body.page
    ? req.body.page
    : constants.settings.defaultPageNo;
  const skip = count * (req.body.page - 1);

  let condition = {};
   console.log(req.body);
  if (req.body.isActive != "" && req.body.isActive != undefined) {
    condition.isActive = req.body.isActive == "true" ? true : false;
  }
  
  if(req.body.type){
    condition.type = { $in: req.body.type };
  }
  
  if (req.body.isDeleted)
    condition.isDeleted = req.body.isDeleted == "true" ? true : false;
  else condition.isDeleted = false;

  let sortObject = {id : -1};
  if (req.body.sortValue && req.body.sortOrder) {
    sortObject[req.body.sortValue] = req.body.sortOrder;
  } else {
    sortObject = { display: 1 };
  }

  if (req.body.searchText) {
    const searchText = decodeURIComponent(req.body.searchText).replace(
      /[[\]{}()*+?,\\^$|#\s]/g,
      "\\s+"
    );

    condition.$or = [
      { title: new RegExp(searchText, "gi") },
      { description: new RegExp(searchText, "gi") },
    ];
  }

console.log('sort->', sortObject)

    // return
  const data = await Property.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              id : "$_id",
              title: "$title",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              image : "$image",
              description:"$description",
              images: "$images" ,
              type: "$type" ,
              bedrooms: "$bedrooms" ,
              bathrooms: "$bathrooms",
              size: "$size",
              price:  "$price",
              parking: "$parking",
              date : "$createdAt",
              parkOrGarden:"$parkOrGarden",
              Features: "$Features" ,
              address: "$address",
              contactNo: "$contactNo",
              ownerName: "$ownerName",
            },
          },
          { $sort: sortObject },
          // { $limit: parseInt(skip) + parseInt(count) },
          { $skip: parseInt(skip) },
        ],
      },
    },
  ]);

  if (data[0].aggregatedData.length)
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.ExecutedSuccessfully,
        data[0].aggregatedData,
        data[0].totalCount[0].sum
      )
    );
  else
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.noRecordFound,
        [],
        data[0].totalCount.length
      )
    );
});

exports.updateData = catchAsync(async (req, res, next) => {
  let updateObj = {
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    type : req.body.type,
    display : req.body.display

  };

  console.log( 'updateObj=>>',updateObj )

  await propertyValidation.validateAsync(updateObj);

  const { technologyId } = req.body;

  if (!technologyId)
    return res.json(
      Response(constants.statusCode.unauth, constants.propertyMsg.idReq)
    );

  // const updateData = req.body.technologyData

  const finalResult = await Property.findByIdAndUpdate(
    technologyId,
    updateObj,
    {
      new: true,
    }
  );

  if (finalResult)
   { return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.updateSuccess,
        finalResult
      )
    )
  }
  else return res.json(internalError());
  // const data = { model: Technology, id: technologyId, updateObj }

  // update(req, res, next, data)
});
  
exports.details = catchAsync(async (req, res) => {

  const { propertyId } = req.body;

  if (!propertyId)
    return res.json(
      Response(constants.statusCode.unauth, constants.propertyMsg.idReq)
    );

  const finalResult = await Property.findById(propertyId);

  if (finalResult)
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.ExecutedSuccessfully,
        finalResult
      )
    );
  else
    return res.json(
      Response(constants.statusCode.ok, constants.messages.noRecordFound)
    );
});


// exports.uploadTechnologyImage = (req, res) => {
//   let UPLOADIMAGE = constants.directoryPath.TECHNOLOGY;

//   console.log(req.files)
//   const randomStr = uuid.v4(),
//     currentDate = Date.now(),
//     randomName = randomStr + "-" + currentDate;

//   const size = req.files.file.size,
//     imageBuffer = req.files.file.data,
//     mimetype = req.files.file.mimetype,
//     docOriginalName = req.files.file.name;


//   console.log(mimetype)
//   size should be less then 5mb
//   if (size >= 5000000) return res.json(Response(constants.statusCode.unauth, constants.messages.sizeExceeded));


//   if (mimetype == constants.imageType[0] || mimetype == constants.imageType[1]) {
//     const db_path = randomName + "_" + docOriginalName;
//     const uploadLocation = UPLOADIMAGE + randomName + "_" + docOriginalName;

//     fs.writeFile(uploadLocation, imageBuffer, function (imgErr) {
//       if (imgErr) {
//         return res.json(Response(constants.statusCode.unauth, constants.messages.internalservererror, imgErr));
//       } else {
//         return res.json(Response(constants.statusCode.ok, constants.messages.uploadSuccess, { imagePath: db_path, imageName: uploadLocation },));
//       }
//     });
//   } else {
//     return res.json(Response(constants.statusCode.unauth, constants.messages.invalidImageFormat));
//   }
// };


exports.uploadImage = async (req, res, next) => {
  if (req.files == null || req.files == undefined) {
    return res.json(Response(constants.statusCode.unauth, constants.messages.uploadImageReq));
  }
    


    let fileToBeSend = []
    
    req.files.file.forEach(async(element) => {
      const randomStr = uuid.v4(),
      currentDate = Date.now(),
      randomName = randomStr + "-" + currentDate;
      
      const size = element.size,
      imageBuffer = element.data,
      mimetype = element.mimetype,
      imgOriginalName = element.name;
  
    if (size >= 10000000) {
      return res.json(
        Response(constants.statusCode.unauth, constants.messages.sizeExceeded)
      );
    }
  
    if (mimetype == "image/png" || mimetype == "image/jpeg") {
      const UPLOADIMAGE = constants.directoryPath.PROPERTY;
      const db_path = randomName + "_" + imgOriginalName;
      const uploadLocation = UPLOADIMAGE + randomName;
  
        await fileToBeSend.push(db_path)
        await fs.writeFile(uploadLocation, imageBuffer, function (imgErr) {
  
        if (!imgErr) {
          fs.readFile(uploadLocation, async function (err, data) {
            if (err) {
              return res.json(Response(constants.statusCode.unauth, err));
            }
            
          })
        } else {
          console.log('imgErr=>>>', imgErr)
        }
      });
    } else {
      return res.json(Response(constants.statusCode.unauth, constants.messages.invalidImageFormat));
    }
    });

    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.uploadSuccess,
        fileToBeSend
      )
    );
    
};

exports.changeStatus = toggleStatus(Property);

exports.deleteProperty = softDelete(Property);