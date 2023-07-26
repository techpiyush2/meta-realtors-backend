"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { industriesValidation } = require("../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Industries = require("../models/industries_model");

exports.addIndustry = catchAsync(async (req, res) => {
  let insertObj = {
    title: req.body.title,
    image: req.body.image,
    type: req.body.type,
    display: req.body.display,
  };

  // to prevent dublicacy

  const isIndustry = await Industries.findOne({
    title: req.body.title,
  });
  if (isIndustry)
    return res.json(
      Response(constants.statusCode.unauth, constants.industriesMsg.exist)
    );

  await industriesValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;

  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await Industries.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.servicesMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.industryList = catchAsync(async (req, res) => {
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
  
  if (req.body.type) {
    condition.type = req.body.type;
  }

  if (req.body.searchText) {
    const searchText = decodeURIComponent(req.body.searchText).replace(
      /[[\]{}()*+?,\\^$|#\s]/g,
      "\\s+"
    );

    condition.$or = [
      { title: new RegExp(searchText, "gi") },
      // { content: new RegExp(searchText, "gi") },
      // { technology: new RegExp(searchText, "gi") },
    ];
  }

  const data = await Industries.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              title: "$title",
              image: "$image",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              type: "$type",
              display: "$display",
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
    // content: req.body.content,
    image: req.body.image,
    type: req.body.type,
    display: req.body.display,

    // technology: req.body.technology,
  };

  await industriesValidation.validateAsync(updateObj);

  const { industryId } = req.body;

  if (!industryId)
    return res.json(
      Response(constants.statusCode.unauth, constants.servicesMsg.idReq)
    );

  // const updateData = req.body.servicesData

  const finalResult = await Industries.findByIdAndUpdate(
    industryId,
    updateObj,
    {
      new: true,
    }
  );

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
  const { industryId } = req.body;

  if (!industryId)
    return res.json(
      Response(constants.statusCode.unauth, constants.servicesMsg.idReq)
    );

  const finalResult = await Industries.findById({ _id: industryId });

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

exports.changeStatus = toggleStatus(Industries);

exports.deleteIndustry = softDelete(Industries);
