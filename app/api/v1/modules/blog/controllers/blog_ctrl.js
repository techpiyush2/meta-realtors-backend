"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { blogValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  fs = require("fs"),
  sharp = require("sharp"),
  Blog = require("../models/blog_model");
const uuid = require("uuid");


exports.addBlog = catchAsync(async (req, res) => {

  let isExist = await Blog.findOne({ title: req.body.title })

  if (isExist) {
    return res.json(
      Response(constants.statusCode.unauth, constants.blogMsg.blogExist)
    );
  }

  let insertObj = {
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    metaDescription : req.body.metaDescription,
    type : req.body.type
  };

  await blogValidation.validateAsync(insertObj);

  const finalResult = await Blog.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.blogMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.blogList = catchAsync(async (req, res) => {
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


  if (req.body.type) condition.type = req.body.type;

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
      { description: new RegExp(searchText, "gi") }
    ];
  }
  const data = await Blog.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              title: "$title",
              image: "$image",
              description: "$description",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              date: "$date",
              type: "$type",
              blogyr: { $dateToString: { format: "%Y", date: "$createdAt" } },
              blogmnt: { $dateToString: { format: "%m", date: "$createdAt" } },
              blogdat: { $dateToString: { format: "%d", date: "$createdAt" } },
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
    image: req.body.image,
    metaDescription : req.body.metaDescription,
    type : req.body.type
  };

  await blogValidation.validateAsync(updateObj);

  const { blogId } = req.body;

  if (!blogId)
    return res.json(
      Response(constants.statusCode.unauth, constants.blogMsg.idReq)
    );


  const finalResult = await Blog.findByIdAndUpdate(blogId, updateObj, {
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

});

exports.details = catchAsync(async (req, res) => {

  const { blogId } = req.body;

  if (!blogId)
    return res.json(
      Response(constants.statusCode.unauth, constants.blogMsg.idReq)
    );

  const finalResult = await Blog.findById(blogId);

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


exports.uploadImage = async (req, res, next) => {

  if (req.files == null || req.files == undefined) {
    return res.json(Response(constants.statusCode.unauth, constants.messages.uploadImageReq));
  }
    
  const randomStr = uuid.v4(),
    currentDate = Date.now(),
    randomName = randomStr + "-" + currentDate;

    const size = req.files.file.size,
    imageBuffer = req.files.file.data,
    mimetype = req.files.file.mimetype,
    imgOriginalName = req.files.file.name;

  if (size >= 5000000) {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.sizeExceeded)
    );
  }

  if (mimetype == "image/png" || mimetype == "image/jpeg") {
    const UPLOADIMAGE = constants.directoryPath.BLOG;
    const db_path = randomName + "_" + imgOriginalName;
    const uploadLocation = UPLOADIMAGE + randomName + "_" + imgOriginalName;


    await fs.writeFile(uploadLocation, imageBuffer, function (imgerr) {

      if (!imgerr) {
        fs.readFile(uploadLocation, async function (err, data) {
          if (err) {
            return res.json(Response(constants.statusCode.unauth, err));
          }

          return res.json(
            Response(
              constants.statusCode.ok,
              constants.messages.uploadSuccess,
              {
                fullPath: uploadLocation,
                imagePath: db_path,
              }
            )
          );

        })
      } else {
        console.log('imgerr=>>>', imgerr)
      }
    });
  } else {
    return res.json(Response(constants.statusCode.unauth, constants.messages.invalidImageFormat));
  }

};



exports.changeStatus = toggleStatus(Blog);

exports.deleteBlog = softDelete(Blog);
