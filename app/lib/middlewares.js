const fs = require("fs"),
  uuid = require("uuid"),
  sharp = require("sharp"),
  utility = require("./utility"),
  query = require("./common_query"),
  { Response, internalError } = require("./../lib/response"),
  catchAsync = require("./catchAsync"),
  constants = require("./../lib/constants");

/********************************************************************************
 *                   MULTIPLE    USE    FUNCTIONS
 ********************************************************************************
 */

// IMAGE UPLOAD
exports.uploadImage = (req, res) => {
  // return
  if (!req.body.type)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.uploadTypeReq)
    );
  let UPLOADIMAGE;

  switch (req.body.type) {
    case "BLOG":
      UPLOADIMAGE = constants.directoryPath.BLOG;
      break;
    // images for services
    case "SERVICES":
      UPLOADIMAGE = constants.directoryPath.SERVICES;
      break;

    // images for industries
    case "INDUSTRY":
      UPLOADIMAGE = constants.directoryPath.INDUSTRY;
      break;

    // JOB apply files
    case "RESUME":
      UPLOADIMAGE = constants.directoryPath.RESUMES;
      break;
    // images for technology
    case "TECHNOLOGY":
      UPLOADIMAGE = constants.directoryPath.TECHNOLOGY;
      break;

    case "USER":
      UPLOADIMAGE = constants.directoryPath.USER;
      break;
    case "TESTIMONIAL":
      UPLOADIMAGE = constants.directoryPath.TESTIMONIAL;
      break;
    case "USERTESTIMONIAL":
      UPLOADIMAGE = constants.directoryPath.USERTESTIMONIAL;
      break;
    //USER_TESTIMONIAL
  }

  // console.log(req.body);
  // return false

  const randomStr = uuid.v4(),
    currentDate = Date.now(),
    randomName = randomStr + "-" + currentDate;

  // let height, width
  // req.body.height ? ({ height } = req.body) : (height = 200)
  // req.body.width ? ({ width } = req.body) : (width = 200)

  const size = req.files.file.size,
    imageBuffer = req.files.file.data,
    mimetype = req.files.file.mimetype,
    imgOriginalName = req.files.file.name;

  // size should be less then 5mb
  if (size >= 5000000)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.sizeExceeded)
    );

  if (mimetype == "image/png" || mimetype == "image/jpeg") {
    const db_path = randomName + "_" + imgOriginalName;
    const uploadLocation = UPLOADIMAGE + randomName + "_" + imgOriginalName;

    fs.writeFile(uploadLocation, imageBuffer, function (imgerr) {
      if (imgerr)
        return res.json(
          Response(
            constants.statusCode.internalservererror,
            constants.messages.imgNotUpload,
            imgerr
          )
        );

      fs.readFile(uploadLocation, function (err, data) {
        if (err)
          return res.json(
            Response(
              constants.statusCode.internalservererror,
              constants.messages.imgNotUpload,
              err
            )
          );

        const thumbpath =
          UPLOADIMAGE + "thumbnail/" + randomName + "_" + imgOriginalName;

        sharp(imageBuffer)
          .resize(348, 280)
          .toFile(thumbpath, (err, info) => {
            if (!err) {
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
            }
            return res.json(
              Response(
                constants.statusCode.unauth,
                constants.messages.imgNotUpload + err
              )
            );
          });
      });
    });
  } else {
    console.log("wriong format");
    return res.json(
      Response(
        constants.statusCode.unauth,
        constants.messages.invalidImageFormat
      )
    );
  }
};

// DOCUMENTS UPLOAD
exports.uploads = (req, res, options) => {
  /**
   * Options must include the following :-
   *    uploadPath
   *    uploadTypes
   *    maxSize
   *    minSize
   *    typeMsg
   */

  if (
    !options.uploadPath ||
    !options.uploadTypes ||
    !options.maxSize ||
    !options.minSize ||
    !options.typeMsg
  )
    return res.json(
      Response(constants.statusCode.failed, constants.messages.optionsMissing)
    );

  const randomStr = uuid.v4(),
    currentDate = Date.now(),
    randomName = randomStr + "-" + currentDate;

  const buffer = req.files.file.data,
    orignalSize = req.files.file.size,
    mimetype = req.files.file.mimetype,
    originalName = req.files.file.name;

  // Checking weather the document in valid format or not such as pdf or jpg
  const isValidType = options.uploadTypes.includes(mimetype);

  if (isValidType) {
    // If document is of valid type we have to check that it should be in specified size
    let { maxSize, minSize } = options;

    maxSize = convertIntoKB(maxSize);
    minSize = convertIntoKB(minSize);

    // Also size should be greater then specified size
    if (orignalSize <= minSize)
      return res.json(
        Response(
          constants.statusCode.unauth,
          `${constants.messages.atleastMinSize} ${options.minSize}`
        )
      );

    // size should be less then specified size
    if (orignalSize >= maxSize)
      return res.json(
        Response(
          constants.statusCode.unauth,
          `${constants.messages.maxSizeExceeded} ${options.maxSize}`
        )
      );

    const db_path = randomName + "_" + originalName;
    const uploadLocation = options.uploadPath + randomName + "_" + originalName;

    console.log("uploadLocation", uploadLocation);

    fs.writeFile(uploadLocation, buffer, function (err) {
      if (!err) {
        return res.json(
          Response(constants.statusCode.ok, constants.messages.uploadSuccess, {
            fullPath: uploadLocation,
            db_name: db_path,
          })
        );
      }
      return res.json(internalError());
    });
  } else {
    return res.json(Response(constants.statusCode.unauth, options.typeMsg));
  }
};

function convertIntoKB(input) {

  let [value, type] = input.split(" ");

  // Converting string to number
  value = Number(value);
  type = type.toLowerCase();

  switch (type) {
    case "mb":
      value = value * 1000000;
      break;

    case "gb":
      value = value * 1000000000;
      break;

    case "tb":
      value = value * 1000000000000;
      break;

    default:
      value = value;
      break;
  }
  return value;
}

exports.deleteImage = (req, res) => {
  const file = req.body.file,
    filePath = req.body.filePath;

  fs.unlink(filePath + file, function (err) {
    if (err) {
      return res.json(internalError(err));
    }

    fs.unlink(filePath + "thumbnail/" + file, function (err) {
      if (err) {
        return res.json(internalError(err));
      } else {
        return res.json(
          Response(constants.statusCode.ok, constants.messages.imageDeleted)
        );
      }
    });
  });
};
