const constants = require('./constants')

module.exports = catchAsync = (fn) => {
  return (req, res, next) =>
    fn(req, res, next).catch((error) => {
      // If env is "local" we have to print whole error
      if (process.env.NODE_ENV == 'local') {
        console.log(`******************* SERVER ERROR !! *******************`)
        console.log(error)
      } else {
        console.log('Something went wrong !')
      }

      // console.log(error)

      if (error.isJoi) {
        res.json({
          code: constants.statusCode.unauth,
          message: error.details[0].message,
          error: process.env.NODE_ENV == 'local' ? error : {},
        })
      } else if (error.name == 'ValidationError') {
        res.json({
          code: constants.statusCode.unauth,
          message: constants.messages.validationError,
          error: process.env.NODE_ENV == 'local' ? error : {},
        })
      } else {
        res.json({
          code: constants.statusCode.internalservererror,
          message: constants.messages.internalError,
          error: process.env.NODE_ENV == 'local' ? error : {},
        })
      }
    })
}
