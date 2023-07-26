﻿"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { technologyValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Technology = require("../models/technology_model"),
  fs = require("fs"),
  uuid = require("uuid");


exports.addTechnology = catchAsync(async (req, res) => {
  let insertObj = {
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    type : req.body.type,
    display : req.body.display
  };

  // to prevent dublicacy{technologyres shd be same}
  const technologyres = await Technology.findOne({ title: req.body.title });

  if (technologyres)
    return res.json(
      Response(constants.statusCode.unauth, constants.technologyMsg.exist)
    );

  await technologyValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;


  if (!createdby_id){
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );
  }
    

  insertObj.createdby_id = createdby_id;

  const finalResult = await Technology.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.technologyMsg.addSuccess)
    );
  else return res.json(internalError());
});



exports.technologyList = catchAsync(async (req, res) => {
  const count = req.body.count ? req.body.count : constants.settings.count;
  req.body.page = req.body.page
    ? req.body.page
    : constants.settings.defaultPageNo;
  const skip = count * (req.body.page - 1);

  let condition = {};

  if (req.body.isActive != "" && req.body.isActive != undefined) {
    condition.isActive = req.body.isActive == "true" ? true : false;
  }

  if (req.body.isDeleted)
    condition.isDeleted = req.body.isDeleted == "true" ? true : false;
  else condition.isDeleted = false;

  let sortObject = {};
  if (req.body.sortValue && req.body.sortOrder) {
    sortObject[req.body.sortValue] = req.body.sortOrder;
  } else {
    sortObject = { display: 1 };
  }

  
  if(req.body.type){
    condition.type  = req.body.type
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
  const data = await Technology.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              title: "$title",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              image : "$image",
              type : "$type",
              description:"$description",
              display:"$display"
              // technologyyr: {
              //   $dateToString: { format: "%Y", date: "$createdAt" },
              // },
              // technologymnt: {
              //   $dateToString: { format: "%M", date: "$createdAt" },
              // },
              // technologydat: {
              //   $dateToString: { format: "%d", date: "$createdAt" },
              // },
            },
          },
          { $sort: sortObject },
          { $limit: parseInt(skip) + parseInt(count) },
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

  await technologyValidation.validateAsync(updateObj);

  const { technologyId } = req.body;

  if (!technologyId)
    return res.json(
      Response(constants.statusCode.unauth, constants.technologyMsg.idReq)
    );

  // const updateData = req.body.technologyData

  const finalResult = await Technology.findByIdAndUpdate(
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

  const { technologyId } = req.body;

  if (!technologyId)
    return res.json(
      Response(constants.statusCode.unauth, constants.technologyMsg.idReq)
    );

  const finalResult = await Technology.findById(technologyId);

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

//     fs.writeFile(uploadLocation, imageBuffer, function (imgerr) {
//       if (imgerr) {
//         return res.json(Response(constants.statusCode.unauth, constants.messages.internalservererror, imgerr));
//       } else {
//         return res.json(Response(constants.statusCode.ok, constants.messages.uploadSuccess, { imagePath: db_path, imageName: uploadLocation },));
//       }
//     });
//   } else {
//     return res.json(Response(constants.statusCode.unauth, constants.messages.invalidImageFormat));
//   }
// };



exports.changeStatus = toggleStatus(Technology);

exports.deleteTechnology = softDelete(Technology);
