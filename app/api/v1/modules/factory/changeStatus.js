const catchAsync = require("../../../../lib/catchAsync"),
  { Response, internalError } = require("../../../../lib/response"),
  constants = require("../../../../lib/constants"),
  query = require("../../../../lib/common_query");

module.exports = (Model) =>
  catchAsync(async (req, res) => {
    if (!req.body.id)
      return res.json(
        Response(constants.statusCode.unauth, constants.messages._idReq)
      );

    if (typeof req.body.isActive !== "boolean")
      return res.json(
        Response(constants.statusCode.unauth, constants.messages.isActive)
      );

    const condition = { _id: req.body.id };
    const updateData = { isActive: !req.body.isActive };

    const finalResult = await query.updateOneDocument(
      Model,
      condition,
      updateData
    );
    const msg = req.body.isActive
      ? constants.messages.deActivated
      : constants.messages.activated;

    if (!finalResult.status) return res.json(internalError());

    if (finalResult.data)
      return res.json(Response(constants.statusCode.ok, msg, finalResult.data));
    else
      return res.json(
        Response(constants.statusCode.ok, constants.messages.noRecordFound)
      );
  });
