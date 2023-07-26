"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
    catchAsync = require("../../../../../lib/catchAsync"),
    toggleStatus = require("../../factory/changeStatus"),
    constants = require("../../../../../lib/constants"),
    softDelete = require("../../factory/softDelete"),
    Attendence = require("../models/attendence_model"),
    fs = require("fs"),
    mailer = require("../../../../../lib/mailer"),
    uuid = require("uuid");
const convertCsv = require('csvtojson')


exports.addAttendence = catchAsync(async (req, res) => {
    if (!req.body.file) {
        return res.json(
            Response(constants.statusCode.unauth, constants.attendenceMsg.file)
        );
    }
    if (!req.body.createdById) {
        return res.json(
            Response(constants.statusCode.unauth, constants.messages._idReq)
        );
    }

    const listData = await convertCsv().fromFile(`upload/attendence/${req.body.file}`)

    let setAttendence = []
    listData.map(object => {
        Object.keys(object).forEach(function (key) {
            var newKey = key.replace(/\s+/g, '');
            if (object[key] && typeof object[key] === 'object') {
                replaceKeys(object[key]);
            }
            if (key !== newKey) {
                object[newKey] = object[key];
                delete object[key];
            }
        });
        setAttendence.push(object)
    })

    const insertObj = {
        date: new Date(req.body.date).toISOString().split("T")[0],
        createdById: req.body.createdById,
        attendence: setAttendence
    }

    const finalData = await Attendence.create(insertObj)


    if (finalData) {

        finalData.attendence.map((data) => {

            const printContents = {
                Name: data.EmpName,
                EMPCode: data.EMPCode,
                InTime: data.InTime,
                OutTime: data.OutTime,
                ShiftHrs: data.ShiftHrs,
            }

            const options = {
                to: data.email,
                subject: 'Attendence'
            }

            mailer.attendece(options, printContents)
        })





        return res.json(
            Response(constants.statusCode.ok, constants.attendenceMsg.attendenceSuccess)
        );
    } else {
        return res.json(
            Response(constants.statusCode.unauth, constants.messages.internalservererror)
        );
    }




})




exports.uploadFile = (req, res) => {
    let UPLOADIMAGE = constants.directoryPath.ATTENDENCE;




    const randomStr = uuid.v4(),
        currentDate = Date.now(),
        randomName = randomStr + "-" + currentDate;

    const size = req.files.file.size,
        imageBuffer = req.files.file.data,
        mimetype = req.files.file.mimetype,
        docOriginalName = req.files.file.name;

    // size should be less then 5mb
    // if (size >= 5000000) return res.json(Response(constants.statusCode.unauth, constants.messages.sizeExceeded));


    if (mimetype == "text/csv") {
        const db_path = randomName + "_" + docOriginalName;
        const uploadLocation = UPLOADIMAGE + randomName + "_" + docOriginalName;

        fs.writeFile(uploadLocation, imageBuffer, function (imgerr) {
            if (imgerr) {
                return res.json(Response(constants.statusCode.unauth, constants.messages.internalservererror, imgerr));
            } else {
                return res.json(Response(constants.statusCode.ok, constants.messages.successfullyExecuted, { name: db_path, path: uploadLocation },));
            }
        });
    } else {
        return res.json(Response(constants.statusCode.unauth, constants.attendenceMsg.invalidFormat));
    }
};


exports.attendenceList = catchAsync(async (req, res) => {

    const count = req.body.count ? req.body.count : constants.settings.count;
    req.body.page = req.body.page ? req.body.page : constants.settings.defaultPageNo;
    const skip = count * (req.body.page - 1);

    let condition = {};

    if (req.body.date != "" && req.body.date != undefined) {
        condition.date = new Date(req.body.date).toISOString().split("T")[0];
    }

    if (req.body.searchText) {
        const searchText = decodeURIComponent(req.body.searchText).replace(
            /[[\]{}()*+?,\\^$|#\s]/g,
            "\\s+"
        );

        condition.$or = [{ category: new RegExp(searchText, "gi") }];
    }
    const data = await Attendence.aggregate([
        { $match: condition },
        {
            $facet: {
                totalCount: [{ $count: "sum" }],
                aggregatedData: [
                    {
                        $project: {
                            date: "$date",
                            attendence: "$attendence",
                        },
                    },
                    // { $sort: sortObject },
                    { $limit: parseInt(skip) + parseInt(count) },
                    { $skip: parseInt(skip) },
                ],
            },
        },
    ]);




    // return

    if (data[0].aggregatedData.length) {
        return res.json(
            Response(constants.statusCode.ok, constants.attendenceMsg.attendenceSuccess, data[0].aggregatedData, data[0].totalCount[0].sum)
        );
    } else {
        return res.json(
            Response(constants.statusCode.ok, constants.messages.noRecordFound, [],
                data[0].totalCount.length)
        );
    }
})


exports.empAttendence = catchAsync(async (req, res) => {

    if (!req.body.sNo) {
        return res.json(
            Response(constants.statusCode.ok, constants.attendenceMsg.employeeIdReq)
        );
    }
    let condition = {}

    if (req.body.formDate && req.body.toDate) {
        condition.date = { $gte: req.body.formDate, $lte: req.body.toDate }
    }

    let data = await Attendence.find(condition, { attendence: { $elemMatch: { SNo: req.body.sNo } } })

    if (data.length) {
        return res.json(
            Response(constants.statusCode.ok, constants.messages.ExecutedSuccessfully, data, data.length)
        );
    } else {
        return res.json(
            Response(constants.statusCode.ok, constants.messages.noRecordFound, data)
        );
    }

})













































// exports.attendenceList = catchAsync( async(req , res)=>{

//     const listData =   await convertCsv().fromFile('upload/attendence/22950e5f-1803-4abf-90ba-8573121d8d12-1641895077854_Attendance.csv')
//     listData.splice(0,4)
//     let data 
//     let finalData=[]
//     listData.map((res)=>{
//         data = JSON.stringify(res)
//         finalData.push(JSON.parse(data.split("\\t")) ) 

//     })

//     if(finalData){
//         return res.json(
//             Response(constants.statusCode.ok, constants.attendenceMsg.attendenceSuccess ,finalData)
//         );
//     }



// })