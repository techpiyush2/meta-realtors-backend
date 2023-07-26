"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { testimonialValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Testimonial = require("../models/testimonials_model");

exports.addTestimonial = catchAsync(async (req, res) => {
  let createObj = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    designation: req.body.designation,
    type: req.body.type,
  };

  await testimonialValidation.validateAsync(createObj);

  let isExist = await Testimonial.findOne({ name: req.body.name });

  console.log("is", isExist);
  if (isExist) {
    return res.json(
      Response(constants.statusCode.unauth, constants.testimonialMsg.testiExist)
    );
  }

  const finalData = await Testimonial.create(createObj);

  if (finalData) {
    return res.json(
      Response(constants.statusCode.ok, constants.messages.addedSuccess)
    );
  } else {
    return res.json(
      Response(constants.statusCode.unauth, constants.testimonialMsg.testiError)
    );
  }
});

exports.updateTestimonial = catchAsync(async (req, res) => {
  let createObj = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    designation: req.body.designation,
    type: req.body.type,
  };

  await testimonialValidation.validateAsync(createObj);

  if (!req.body.testimonialId) {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages._idReq)
    );
  }

  const finalData = await Testimonial.findByIdAndUpdate(
    { _id: req.body.testimonialId },
    createObj,
    { new: true }
  );

  if (finalData) {
    return res.json(
      Response(constants.statusCode.ok, constants.messages.updateSuccess)
    );
  } else {
    return res.json(
      Response(constants.statusCode.unauth, constants.testimonialMsg.testiError)
    );
  }
});

exports.testimonialList = catchAsync(async (req, res) => {
  const count = req.body.count ? req.body.count : constants.settings.count;
  req.body.page = req.body.page
    ? req.body.page
    : constants.settings.defaultPageNo;
  const skip = count * (req.body.page - 1);

  let condition = {};

  if (req.body.isActive != "" && req.body.isActive != undefined) {
    condition.isActive = req.body.isActive == "true" ? true : false;
  }
  if (req.body.isDeleted != "" && req.body.isDeleted != undefined) {
    condition.isDeleted = req.body.isDeleted == "true" ? true : false;
  }
  if (req.body.type === "IT") {
    condition.type = "IT";
  }
  if (req.body.type === "ENGINEERING") {
    condition.type = "ENGINEERING";
  }

  if (req.body.type === "MEDICAL") {
    condition.type = "MEDICAl";
  }
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
      { name: new RegExp(searchText, "gi") },
      { description: new RegExp(searchText, "gi") },
    ];
  }
  let data = await Testimonial.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              name: "$name",
              description: "$description",
              designation: "$designation",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              image: "$image",
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

  if (data[0].aggregatedData.length) {
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.ExecutedSuccessfully,
        data[0].aggregatedData,
        data[0].totalCount[0].sum
      )
    );
  } else {
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.noRecordFound,
        [],
        data[0].totalCount.length
      )
    );
  }
});
exports.testimonialDetails = catchAsync(async (req, res) => {
  const { testimonialId } = req.body;

  if (!testimonialId) {
    return res.json(
      Response(constants.statusCode.unauth, constants.testimonialMsg.idReq)
    );
  }

  const finalResult = await Testimonial.findById(testimonialId);

  if (finalResult) {
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.ExecutedSuccessfully,
        finalResult
      )
    );
  } else {
    return res.json(
      Response(constants.statusCode.ok, constants.messages.noRecordFound)
    );
  }
});

exports.changeStatus = toggleStatus(Testimonial);

exports.deleteTestimonial = softDelete(Testimonial);
