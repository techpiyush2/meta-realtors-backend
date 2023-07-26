"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  commonQuery = require("../../../../../lib/common_query"),
  { careerValidation } = require("./../../../../../lib/joiSchema"),
  { applicantValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  Applicants = require("../models/apply_job"),
  Career = require("../models/career_model"),
  mailer = require("../../../../../lib/mailer");

exports.addCareer = catchAsync(async (req, res) => {
  let insertObj = {
    skill: req.body.skill,
    description: req.body.description,
    job_title: req.body.job_title,
    location: req.body.location,
    jobType: req.body.jobType,
    type: req.body.type,
  };

  await careerValidation.validateAsync(insertObj);

  if (!req.body.skill.length) {
    return res.json(
      Response(constants.statusCode.unauth, constants.careerMsg.skillReq)
    );
  }

  const { createdby_id } = req.body;

  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await Career.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.careerMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.careerList = catchAsync(async (req, res) => {
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
  // else condition.isDeleted = false;

  let sortObject = {};
  if (req.body.sortValue && req.body.sortOrder) {
    sortObject[req.body.sortValue] = req.body.sortOrder;
  } else {
    sortObject = { _id: 1 };
  }

  if (req.body.jobType) {
    condition.jobType = req.body.jobType;
  }

  if (req.body.skills && req.body.skills.length) {
    condition.skill = { $in: req.body.skills };
  }

  if (req.body.searchText) {
    const searchText = decodeURIComponent(req.body.searchText).replace(
      /[[\]{}()*+?,\\^$|#\s]/g,
      "\\s+"
    );

    condition.$or = [
      { job_title: new RegExp(searchText, "gi") },
      // { description: new RegExp(searchText, "gi") },
      { location: new RegExp(searchText, "gi") },
    ];
  }

  if (req.body.type) condition.type = req.body.type;

  const data = await Career.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              skill: "$skill",
              job_title: "$job_title",
              jobType: "$jobType",
              description: "$description",
              location: "$location",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              type: "$type",
              date: "$date",
              careeryr: { $dateToString: { format: "%Y", date: "$createdAt" } },
              careermnt: {
                $dateToString: { format: "%m", date: "$createdAt" },
              },
              careerdat: {
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
    skill: req.body.skill,
    description: req.body.description,
    job_title: req.body.job_title,
    location: req.body.location,
    jobType: req.body.jobType,
    type: req.body.type,
  };

  await careerValidation.validateAsync(updateObj);

  const { careerId } = req.body;

  if (!careerId)
    return res.json(
      Response(constants.statusCode.unauth, constants.careerMsg.idReq)
    );

  const finalResult = await Career.findByIdAndUpdate(careerId, updateObj, {
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
  // const data = { model: Career, id: careerId, updateObj }

  // update(req, res, next, data)
});

exports.details = catchAsync(async (req, res) => {
  const { careerId } = req.body;

  if (!careerId)
    return res.json(
      Response(constants.statusCode.unauth, constants.careerMsg.idReq)
    );

  const finalResult = await Career.findById(careerId);

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

exports.addApplicant = catchAsync(async (req, res) => {
  let applicantObj = {
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    expInYear: req.body.expInYear,
    expInMonth: req.body.expInMonth,
    file: req.body.file,
    jobId: req.body.jobId,
  };

  await applicantValidation.validateAsync(applicantObj);

  const finalResult = await Applicants.create(applicantObj);

  const applyJobData = await Career.findById({ _id: req.body.jobId });

  const mailOptions = {
    to: ["piyush.zimo@outlook.com"], //"jitendra@zimo.one"
    subject: "Job apply mail",
    // to: "info@zimo.one" ,

  };

  let printContents = {
    name: finalResult.name,
    job: applyJobData.job_title,
    email: finalResult.email,
    contact: finalResult.contact,
    expInYear: finalResult.expInYear,
    expInMonth: finalResult.expInMonth,
    file: finalResult.file,
  };

  const applyJob = await mailer.applyJobEmail(mailOptions, printContents);

  console.log(applyJob);

  if (finalResult) {
    return res.json(
      Response(constants.statusCode.ok, constants.messages.appliedSuccess)
    );
  } else {
    return res.json(
      Response(
        constants.statusCode.unauth,
        constants.messages.internalservererror
      )
    );
  }
});

exports.applicantList = catchAsync(async (req, res) => {
  const count = req.body.count ? req.body.count : constants.settings.count;
  req.body.page = req.body.page
    ? req.body.page
    : constants.settings.defaultPageNo;
  const skip = count * (req.body.page - 1);

  let condition = {};

  let sortObject = {};
  if (req.body.sortValue && req.body.sortOrder) {
    sortObject[req.body.sortValue] = req.body.sortOrder;
  } else {
    sortObject = { _id: -1 };
  }

  // if (!req.body.jobId)
  // return res.json(Response(constants.statusCode.unauth, constants.applicantMsg.jobIdReq));
  if (req.body.jobId) {
    condition.jobId = commonQuery.mongoObjectId(req.body.jobId);
  }

  console.log("con==?>", condition);

  const data = await Applicants.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "careers",
        localField: "jobId",
        foreignField: "_id",
        as: "jobData",
      },
    },
    { $unwind: { path: "$jobData", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: "$name",
        email: "$email",
        contact: "$contact",
        expYears: "$expInYear",
        expInMonth: "$expInMonth",
        resume: "$file",
        jobData: "$jobData.job_title",
      },
    },
    { $sort: sortObject },
    { $limit: parseInt(skip) + parseInt(count) },
    { $skip: parseInt(skip)},
  ]);
  let totalCount = await Applicants.countDocuments({ ...condition });

  if (data) {
    return res.json(
      Response(
        constants.statusCode.ok,
        constants.messages.ExecutedSuccessfully,
        data,
        totalCount
      )
    );
  } else {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.noRecordFound)
    );
  }
});

exports.changeStatus = toggleStatus(Career);

exports.deleteCareer = softDelete(Career);
