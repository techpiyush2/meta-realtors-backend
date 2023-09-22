"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  config = require("../../../../../config/config").get(
    process.env.NODE_ENV || "local"
  ),
  { contactusValidation } = require("../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Contactus = require("../models/contactus_model"),
  mailer = require("../../../../../lib/mailer");

exports.addContactUs = catchAsync(async (req, res) => {
  let insertObj = {
    name: req.body.name,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    message: req.body.message,
  };

  await contactusValidation.validateAsync(insertObj);
  // const { message, email_ID : email, number} = req.body;
 let mailResponse =  await Contactus.create(insertObj);

  if (!mailResponse)     
    return res.json(
      Response(
        constants.statusCode.internalservererror,
        constants.messages.internalservererror
      )
    );
  return res.json(Response(constants.statusCode.ok, constants.contactUsMsg.addSuccess));
});

exports.queryList = catchAsync(async (req, res) => {
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
      { firstName: new RegExp(searchText, "gi") },
      // { date: new RegExp(searchText, "gi") },
      // { image: new RegExp(searchText, "gi") },
    ];
  }

  let data = await Contactus.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              id : "$_id",
              name: 1,
              email: 1,
              mobileNo: 1,
              message: 1,
              createdAt: 1,
              isDeleted : 1
            },
          },
          { $sort: sortObject },
          { $limit: parseInt(skip) + parseInt(count) },
          { $skip: parseInt(skip) },
        ],
      },
    },
  ])

  if (data[0].aggregatedData.length) {
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.ExecutedSuccessfully,
        data[0].aggregatedData,
        data[0].totalCount[0].sum
      )
    );
  }else{
    return res.json(
      Response(
        constants.statusCode.unauth,
        constants.messages.noRecordFound,
        [],
        data[0].totalCount.length
      )
    );
  }

  console.log('data==>', data)


})

exports.details = catchAsync(async (req, res) => {

  const { queryId } = req.body;

  if (!queryId)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages._idReq)
    );

  const finalResult = await Contactus.findById(queryId);

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

exports.delete = softDelete(Contactus);