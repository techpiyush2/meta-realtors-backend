"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
    { addressValidation } = require("../../../../../lib/joiSchema"),
    catchAsync = require("../../../../../lib/catchAsync"),
    toggleStatus = require("../../factory/changeStatus"),
    constants = require("../../../../../lib/constants"),
    softDelete = require("../../factory/softDelete"),
    Address = require("../models/address_model");

exports.addAddress = catchAsync(async (req, res) => {
    let insertObj = {
        address: req.body.address,
        type: req.body.type
    };

    await addressValidation.validateAsync(insertObj);

    const { createdby_id } = req.body;

    if (!createdby_id)
        return res.json(
            Response(constants.statusCode.unauth, constants.messages.user_idReq)
        );

    insertObj.createdby_id = createdby_id;

    const finalResult = await Address.create(insertObj);

    if (finalResult)
        return res.json(
            Response(constants.statusCode.ok, constants.messages.addedSuccess)
        );
    else return res.json(internalError());
});

exports.addressList = catchAsync(async (req, res) => {
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

    //used to match the category
    if (req.body.category) condition.category = req.body.category;

    let sortObject = {};
    if (req.body.sortValue && req.body.sortOrder) {
        sortObject[req.body.sortValue] = req.body.sortOrder;
    } else {
        sortObject = { _id: -1 };
    }

    if (req.body.type) condition.type = req.body.type

    const data = await Address.aggregate([
        { $match: condition },
        {
            $facet: {
                totalCount: [{ $count: "sum" }],
                aggregatedData: [
                    {
                        $project: {
                            address: "$address",
                            isActive: "$isActive",
                            isDeleted: "$isDeleted",
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
                constants.statusCode.unauth,
                constants.messages.noRecordFound,
                [],
                data[0].totalCount.length
            )
        );
});

exports.details = catchAsync(async (req, res) => {
    if (!req.body._id) return res.json(Response(constants.statusCode.unauth, constants.messages._idReq));

    const finalResult = await Address.findById(req.body._id);

    if (finalResult) return res.json(Response(constants.statusCode.ok,constants.messages.ExecutedSuccessfully,finalResult));
    else return res.json(Response(constants.statusCode.ok, constants.messages.noRecordFound));
});

exports.editAddress = catchAsync(async (req, res) => {
    let updateObj = {
        address: req.body.address,
        type: req.body.type
    };

    await addressValidation.validateAsync(updateObj);
    if (!req.body._id) {
        return res.json(
            Response(constants.statusCode.unauth, constants.messages._idReq)
        );
    }

    const finalResult = await Address.findByIdAndUpdate({ _id: req.body._id }, updateObj, { new: true });

    if (finalResult) {
        return res.json(
            Response(constants.statusCode.ok, constants.blogCategoryMsg.addSuccess)
        );
    }
    else return res.json(internalError());
});
exports.changeStatus = toggleStatus(Address);

exports.deleteAdderss = softDelete(Address);
