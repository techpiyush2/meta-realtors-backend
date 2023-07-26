const catchAsync = require('../../../../lib/catchAsync'),
  constants = require('../../../../lib/constants'),
  { Response, internalError } = require('../../../../lib/response'),
  query = require('../../../../lib/common_query')

module.exports = (Model) =>
  catchAsync(async (req, res) => {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) return res.json(Response(constants.statusCode.unauth, constants.messages.requiredFieldsMissing))

    if (!req.body.id) return res.json(Response(constants.statusCode.unauth, constants.messages.user_idReq))

    const condition = { _id: req.body.id }
    const updateData = { isDeleted: true }

    const finalResult = await query.updateOneDocument(Model, condition, updateData)

    if (!finalResult.status) return res.json(internalError())

    if (!finalResult.data) return res.json(Response(constants.statusCode.unauth, constants.messages.internalservererror))
    else return res.json(Response(constants.statusCode.ok, constants.messages.delSuccess, finalResult.data))
  })
