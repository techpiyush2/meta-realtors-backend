'use strict'

const { Response, internalError } = require("../../../../../lib/response"),
  { categoryValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Category = require("../models/category_model");

exports.addCategory = catchAsync(async (req, res) => {
  let insertObj = {
    title: req.body.title,
  };

  await categoryValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;

  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await Category.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.categoryMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.categoryList = catchAsync(async (req, res) => {
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
    ];
  }

  const data = await Category.aggregate([
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
  };

  await categoryValidation.validateAsync(updateObj);

  const { categoryId } = req.body;

  if (!categoryId)
    return res.json(
      Response(constants.statusCode.unauth, constants.categoryMsg.idReq)
    );

  // const updateData = req.body.categoryData

  const finalResult = await Category.findByIdAndUpdate(categoryId, updateObj, {
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
  // const data = { model: category, id: categoryId, updateObj }

  // update(req, res, next, data)
})

exports.details = catchAsync(async (req, res) => {
  const { categoryId } = req.body;

  if (!categoryId)
    return res.json(
      Response(constants.statusCode.unauth, constants.categoryMsg.idReq)
    );

  const finalResult = await Category.findById(categoryId);

  if (finalResult) return res.json(Response(constants.statusCode.ok, constants.messages.ExecutedSuccessfully, finalResult))
  else return res.json(Response(constants.statusCode.ok, constants.messages.noRecordFound))
})

exports.changeStatus = toggleStatus(Category);

exports.deleteCategory = softDelete(Category);
