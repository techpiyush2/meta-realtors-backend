﻿﻿"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { aboutusValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Aboutus = require("../models/aboutus_model");

exports.addAboutus = catchAsync(async (req, res) => {
  let insertObj = {
    title: req.body.title,
    description: req.body.description,
  };

  // to prevent dublicacy{aboutusres shd be same}
  const aboutusres = await Aboutus.findOne({ title: req.body.title });
  if (aboutusres)
    return res.json(
      Response(constants.statusCode.unauth, constants.aboutusMsg.exist)
    );

  await aboutusValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;


  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await Aboutus.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.aboutusMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.aboutusList = catchAsync(async (req, res) => {
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
    sortObject = { _id: -1 };
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
  
  const data = await Aboutus.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              title: "$title",
              description: "$description",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              aboutusyr: {
                $dateToString: { format: "%Y", date: "$createdAt" },
              },
              aboutusmnt: {
                $dateToString: { format: "%M", date: "$createdAt" },
              },
              aboutusdat: {
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
    description: req.body.description,
  };

  await aboutusValidation.validateAsync(updateObj);

  const { aboutusId } = req.body;

  if (!aboutusId)
    return res.json(
      Response(constants.statusCode.unauth, constants.aboutusMsg.idReq)
    );

  // const updateData = req.body.aboutusData

  const finalResult = await Aboutus.findByIdAndUpdate(aboutusId, updateObj, {
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
  // const data = { model: Aboutus, id: aboutusId, updateObj }

  // update(req, res, next, data)
});

exports.details = catchAsync(async (req, res) => {

  const { aboutusId } = req.body;

  if (!aboutusId)
    return res.json(
      Response(constants.statusCode.unauth, constants.aboutusMsg.idReq)
    );

  const finalResult = await Aboutus.findById(aboutusId);

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

exports.changeStatus = toggleStatus(Aboutus);

exports.deleteAboutus = softDelete(Aboutus);
