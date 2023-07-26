"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { blogCategoryValidation } = require("../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  BlogCategory = require("../models/blogCategory_model");

exports.addBlogCategory = catchAsync(async (req, res) => {
  let insertObj = {
    category: req.body.category,
    type : req.body.type
  };

  await blogCategoryValidation.validateAsync(insertObj);

  const { createdby_id } = req.body;

  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await BlogCategory.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.blogCategoryMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.blogCategoryList = catchAsync(async (req, res) => {
  const count = req.body.count ? req.body.count : constants.settings.count;
  req.body.page = req.body.page
    ? req.body.page
    : constants.settings.defaultPageNo;
  const skip = count * (req.body.page - 1);

  let condition = {};
  let child_condition = {};

  if (req.body.isActive != "" && req.body.isActive != undefined) {
    condition.isActive = req.body.isActive == "true" ? true : false;
  }

  if (req.body.isDeleted)
    condition.isDeleted = req.body.isDeleted == "true" ? true : false;
  else condition.isDeleted = false;

  //used to match the category
  if (req.body.category) condition.category = req.body.category;

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

    condition.$or = [{ category: new RegExp(searchText, "gi") }];
  }

  if( req.body.type ) condition.type = req.body.type

  const data = await BlogCategory.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              category: "$category",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              type: "$type",
              // date: "$date",
              // blogCategoryyr: {
              //   $dateToString: { format: "%Y", date: "$createdAt" },
              // },
              // blogCategorymnt: {
              //   $dateToString: { format: "%M", date: "$createdAt" },
              // },
              // blogCategorydat: {
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
        constants.statusCode.unauth,
        constants.messages.noRecordFound,
        [],
        data[0].totalCount.length
      )
    );
});

exports.updateData = catchAsync(async (req, res, next) => {
  let updateObj = {
    category: req.body.category,
    type : req.body.type
  };

  await blogCategoryValidation.validateAsync(updateObj);

  const { blogCategoryId } = req.body;

  if (!blogCategoryId)
    return res.json(
      Response(constants.statusCode.unauth, constants.blogCategoryMsg.idReq)
    );

  // const updateData = req.body.blogCategoryData

  const finalResult = await  BlogCategory.findByIdAndUpdate({_id : blogCategoryId},updateObj,
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
  // const data = { model: BlogCategory, id: blogCategoryId, updateObj }

  // update(req, res, next, data)
});

exports.details = catchAsync(async (req, res) => {

  const { blogCategoryId } = req.body;

  if (!blogCategoryId)
    return res.json(
      Response(constants.statusCode.unauth, constants.blogCategoryMsg.idReq)
    );

  const finalResult = await BlogCategory.findById(blogCategoryId);

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

exports.changeStatus = toggleStatus(BlogCategory);

exports.deleteBlogCategory = softDelete(BlogCategory);
