"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { servicesValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  fs = require("fs"),
  uuid = require("uuid"),
  Services = require("../models/services_model");
const { findOne } = require("../models/services_model");

exports.addServices = catchAsync(async (req, res) => {


  
  let insertObj = {
    title: req.body.title,
    shortTitle : req.body.shortTitle,
    content: req.body.content,
    img: req.body.img,
    technology: req.body.technology,
    type : req.body.type,
    displayOrder : req.body.displayOrder 
  };

  // // to prevent dublicacy

  const serviceRes = await Services.findOne({
    title: req.body.title,
  });
  if (serviceRes)
    return res.json(
      Response(constants.statusCode.unauth, constants.servicesMsg.exist)
    );

  await servicesValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;

  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await Services.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.servicesMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.servicesList = catchAsync(async (req, res) => {
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

  let sortObject = {displayOrder: 1};
  // if (req.body.sortValue && req.body.sortOrder) {
  //   sortObject[req.body.sortValue] = req.body.sortOrder;
  // } else {
  //   sortObject = { displayOrder: 1 };
  // }

  if(req.body.type){
    condition.type  = req.body.type
  }


  console.log('condito==>',condition)

  if (req.body.searchText) {
    const searchText = decodeURIComponent(req.body.searchText).replace(
      /[[\]{}()*+?,\\^$|#\s]/g,
      "\\s+"
    );

    condition.$or = [
      { title: new RegExp(searchText, "gi") },
      { img: new RegExp(searchText, "gi") },
      { content: new RegExp(searchText, "gi") },
      { technology: new RegExp(searchText, "gi") },
    ];
  }

  const data = await Services.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              title: "$title",
              img: "$img",
              technology: "$technology",
              content: "$content",
              shortTitle : "$shortTitle" , 
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              displayOrder:"$displayOrder",
              type:"$type",
              servicesyr: {
                $dateToString: { format: "%Y", date: "$createdAt" },
              },
              servicesmnt: {
                $dateToString: { format: "%M", date: "$createdAt" },
              },
              servicesdat: {
                $dateToString: { format: "%d", date: "$createdAt" },
              },
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
    content: req.body.content,
    img: req.body.img,
    technology: req.body.technology,
    shortTitle : req.body.shortTitle,
    type : req.body.type,
    displayOrder : req.body.displayOrder 
  };

  await servicesValidation.validateAsync(updateObj);

  const { servicesId } = req.body;

  if (!servicesId)
    return res.json(
      Response(constants.statusCode.unauth, constants.servicesMsg.idReq)
    );

  // const updateData = req.body.servicesData

  const finalResult = await Services.findByIdAndUpdate(servicesId, updateObj, {
    new: true,
  });

  if (finalResult)
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.updateSuccess,
        finalResult
      )
    );
  else return res.json(internalError());
  // const data = { model: Services, id: servicesId, updateObj }

  // update(req, res, next, data)
});

exports.details = catchAsync(async (req, res) => {

  const { servicesId } = req.body;

  if (!servicesId)
    return res.json(
      Response(constants.statusCode.unauth, constants.servicesMsg.idReq)
    );

  const finalResult = await Services.findById(servicesId);

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


exports.uploadServiceImage = (req, res) => {
  let UPLOADIMAGE = constants.directoryPath.SERVICES;

  const randomStr = uuid.v4(),
    currentDate = Date.now(),
    randomName = randomStr + "-" + currentDate;

  const size = req.files.file.size,
    imageBuffer = req.files.file.data,
    mimetype = req.files.file.mimetype,
    docOriginalName = req.files.file.name;
  // size should be less then 5mb
  if (size >= 5000000) return res.json(Response(constants.statusCode.unauth, constants.messages.sizeExceeded));


  if (mimetype == constants.imageType[0] || mimetype == constants.imageType[1]) {
    const db_path = randomName + "_" + docOriginalName;
    const uploadLocation = UPLOADIMAGE + randomName + "_" + docOriginalName;

    fs.writeFile(uploadLocation, imageBuffer, function (imgerr) {
      if (imgerr) {
        return res.json(Response(constants.statusCode.unauth, constants.messages.internalservererror, imgerr));
      } else {
        return res.json(Response(constants.statusCode.ok, constants.messages.uploadSuccess, { imagePath: db_path, imageName: uploadLocation },));
      }
    });
  } else {
    return res.json(Response(constants.statusCode.unauth, constants.messages.invalidImageFormat));
  }
};


exports.changeStatus = toggleStatus(Services);

exports.deleteServices = softDelete(Services);
