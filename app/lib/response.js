/**
 * This file is meant for giving the custom response
 * params @code | @status | @message | @data | @token
 */

const constants = require("./constants");

exports.Response = function (code, message, data, totalCount) {
  const response = {};
  response.code = code;
  response.message = message;
  response.data = data;
  if (totalCount === 0 || totalCount) response.totalCount = totalCount;

  return response;
};

exports.internalError = function (error){
  /** It will return an object
   *
   * {
   *    code: 500
   *    message: "Internal server error"
   * }
   *
   */

  const errorObj = {
    code: constants.statusCode.internalservererror,
    message: constants.messages.internalservererror,
  };

  error && process.env.NODE_ENV == "local" ? (errorObj.error = error) : true;

  return errorObj;
};
