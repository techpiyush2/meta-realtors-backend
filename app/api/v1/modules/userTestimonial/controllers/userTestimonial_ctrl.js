"use strict";

const { Response } = require("../../../../../lib/response"),
  { userTestimonialValidation } = require("../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  constants = require("../../../../../lib/constants"),
  toggleStatus = require("../../factory/changeStatus"),
  softDelete = require("../../factory/softDelete"),
  UserTestimonial = require("../models/userTestomonial_model");

module.exports.createUserTestimonials = catchAsync(async (req, res) => {
  let createObj = {
    image: req.body.image,
    name: req.body.name,
    location: req.body.location,
    rating: req.body.rating,
    description: req.body.description,
    type: req.body.type
  };

  await userTestimonialValidation.validateAsync(createObj);

  let userExist = await UserTestimonial.findOne({ name: req.body.name });

  console.log("is", userExist);

  if (userExist) {
    return res.json(
      Response(constants.statusCode.unauth, constants.testimonialMsg.testiExist)
    );
  }
  
  const newData = await UserTestimonial.create(createObj);
  if (newData) {
    return res.json(
      Response(constants.statusCode.ok, constants.messages.addedSuccess)
    );
  } else {
    return res.json(
      Response(constants.statusCode.unauth, constants.testimonialMsg.testiError)
    );
  }
});

exports.updateUserTestimonial = catchAsync(async (req, res) => {
  let createObj = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    rating: req.body.rating,
    location: req.body.location,
    type: req.body.type,
  };

  await userTestimonialValidation.validateAsync(createObj);
  if (!req.body._id) {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages._idReq)
    );
  }

  const updatedData = await UserTestimonial.findByIdAndUpdate(
    { _id: req.body._id },
    createObj,
    { new: true }
  );

  console.log(updatedData);
  if (updatedData) {
    return res.json(
      Response(constants.statusCode.ok, constants.messages.updateSuccess)
    );
  } else {
    return res.json(
      Response(constants.statusCode.unauth, constants.testimonialMsg.testiError)
    );
  }
});

exports.changeStatus = toggleStatus(UserTestimonial);

exports.deleteUserTestimonial = softDelete(UserTestimonial);


exports.testimonialDetails = catchAsync(async (req, res) => {

  const { testimonialId } = req.body;

  if (!testimonialId){
      return res.json( Response(constants.statusCode.unauth, constants.testimonialMsg.idReq))
  }

  const finalResult = await UserTestimonial.findById(testimonialId);

  if (finalResult){
      return res.json(Response(constants.statusCode.ok,constants.messages.ExecutedSuccessfully,finalResult));
  }
  else{

      return res.json(Response(constants.statusCode.ok, constants.messages.noRecordFound));
  }
});


exports.testimonialList = catchAsync(async (req, res) => {
  const count = req.body.count ? req.body.count : constants.settings.count;
  req.body.page = req.body.page ? req.body.page : constants.settings.defaultPageNo;
  const skip = count * (req.body.page - 1);

  let condition = {}
  // if (req.body.isActive != "" && req.body.isActive != undefined) {
  //   condition.isActive = req.body.isActive == "true" ? true : false;
  // }
  if (req.body.isDeleted != "" && req.body.isDeleted != undefined) {
    condition.isDeleted = req.body.isDeleted == "true" ? true : false;
  }

  if(req.body.isActive === "true"){
    condition.isActive = true
  }

  if(req.body.isActive === "false"){
    condition.isActive = false
  }

   
  if (req.body.type === "IT") {
    condition.type = "IT";
  }
  if (req.body.type === "ENGINEERING") {
    condition.type = "ENGINEERING";
  }

  if (req.body.type === "MEDICAL") {
    condition.type = "MEDICAL";
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
  let data = await UserTestimonial.aggregate([
      { $match: condition },
      {
          $facet: {
              totalCount: [{ $count: "sum" }],
              aggregatedData: [
                  {
                      $project: {
                          name: "$name",
                          description: "$description",
                          isActive: "$isActive",
                          location : "$location",
                          rating : "$rating",
                          isDeleted: "$isDeleted",
                          type : "$type",
                          image: "$image",
                      },
                  },
                  { $sort: sortObject },
                  { $limit: parseInt(skip) + parseInt(count) },
                  { $skip: parseInt(skip) },
              ],
          },
      }

  ])

  if (data[0].aggregatedData.length) {
      return res.json(Response(constants.statusCode.ok, constants.messages.ExecutedSuccessfully, data[0].aggregatedData, data[0].totalCount[0].sum));
  }
  else {
      return res.json(Response(constants.statusCode.ok, constants.messages.noRecordFound, [], data[0].totalCount.length));
  }
})

exports.testimonialDetails = catchAsync(async (req, res) => {

  const { testimonialId } = req.body;

  if (!testimonialId){
      return res.json( Response(constants.statusCode.unauth, constants.testimonialMsg.idReq))
  }

  const finalResult = await Testimonial.findById(testimonialId);
 
  if (finalResult){
      return res.json(Response(constants.statusCode.ok,constants.messages.ExecutedSuccessfully,finalResult));
  }
  else{

      return res.json(Response(constants.statusCode.ok, constants.messages.noRecordFound));
  }
});
