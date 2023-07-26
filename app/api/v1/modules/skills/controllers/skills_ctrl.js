'use strict'

const { Response, internalError } = require('../../../../../lib/response'),
  { skillsValidation } = require('./../../../../../lib/joiSchema'),
  catchAsync = require('../../../../../lib/catchAsync'),
  toggleStatus = require('../../factory/changeStatus'),
  constants = require('../../../../../lib/constants'),
  softDelete = require('../../factory/softDelete'),
  Skills = require('../models/skills_model')

exports.addSkills = catchAsync(async (req, res) => {
  let insertObj = {
    title: req.body.title,
    type: req.body.type,
  };

  await skillsValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;

  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await Skills.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.skillsMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.skillsList = catchAsync(async (req, res) => {
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
  if( req.body.type ) condition.type = req.body.type

  const data = await Skills.aggregate([
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
              type: "$type",
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
    res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.ExecutedSuccessfully,
        data[0].aggregatedData,
        data[0].totalCount[0].sum
      )
    );
  else
    res.json(
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
    type : req.body.type  
  };

  await skillsValidation.validateAsync(updateObj);

  const { skillsId } = req.body;

  if (!skillsId)
    return res.json(
      Response(constants.statusCode.unauth, constants.skillsMsg.idReq)
    );

  // const updateData = req.body.skillsData

  const finalResult = await Skills.findByIdAndUpdate(skillsId, updateObj, {
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
  // const data = { model: skills, id: skillsId, updateObj }

  // update(req, res, next, data)
})

exports.details = catchAsync(async (req, res) => {
  const { skillsId } = req.body;

  if (!skillsId)
    return res.json(
      Response(constants.statusCode.unauth, constants.skillsMsg.idReq)
    );

  const finalResult = await Skills.findById(skillsId);

  if (finalResult) return res.json(Response(constants.statusCode.ok, constants.messages.ExecutedSuccessfully, finalResult))
  else return res.json(Response(constants.statusCode.ok, constants.messages.noRecordFound))
})

exports.changeStatus = toggleStatus(Skills);

exports.deleteSkills = softDelete(Skills);
