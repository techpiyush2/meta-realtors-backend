"use strict";

const { Response, internalError } = require("../../../../../lib/response"),
  { usersValidation } = require("./../../../../../lib/joiSchema"),
  catchAsync = require("../../../../../lib/catchAsync"),
  toggleStatus = require("../../factory/changeStatus"),
  constants = require("../../../../../lib/constants"),
  softDelete = require("../../factory/softDelete"),
  utilities = require("../../../../../lib/utility"),
  fs = require("fs"),
  mongoose = require("mongoose"),
  mailer = require("../../../../../lib/mailer"),
  config = require("../../../../../../app/config/config.js").get(process.env.NODE_ENV),
  Users = require("../models/users_model");
const uuid = require("uuid");



const jwt = require("jsonwebtoken")
const random_number = require('random-number');
const commonQuery = require("../../../../../lib/common_query");
const { v4: uuidv4 } = require('uuid');
const { mongoObjectId } = require("../../../../../lib/common_query");





exports.addUsers = catchAsync(async (req, res) => {
  let insertObj = {
    email: req.body.email,
    password: req.body.password,
  };

  await usersValidation.validateAsync(insertObj);

  if (!createdby_id)
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.user_idReq)
    );

  insertObj.createdby_id = createdby_id;

  const finalResult = await Users.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.usersMsg.addSuccess)
    );
  else return res.json(internalError());
});

exports.signUp = catchAsync(async (req, res) => {
  let insertObj = {
    email: req.body.email,
    password: req.body.password,
  };

  const alreadyExist = await Users.findOne({email : insertObj.email});
  
  if(alreadyExist) return res.json(
    Response(constants.statusCode.alreadyExist, constants.usersMsg.emailExist)
  );
  
  await usersValidation.validateAsync(insertObj);

  const finalResult = await Users.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.usersMsg.signUp)
    );
  else return res.json(internalError());
});

exports.login = catchAsync(async (req, res) => {

  if (!req.body.email) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.emailReq)
    );
  }
  if (!req.body.password) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.passwordReq)
    );
  }

  const user = await Users.findOne({ email: req.body.email })

  const params = {
    userId: user._id,
  };
  
  if (!user) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.userNotFound)
    );
  } else {
    user.comparePassword(req.body.password, async function (err, isMatch) {
      if (err) return res.json(internalError())
      if (isMatch) {
        const expirationDuration = 60 * 60 * 24 * 10;
        // token expire date is 10 days
  
        const jwtToken = jwt.sign(params, constants.cryptoConfig.secret, {
          expiresIn: expirationDuration,
        });
        const finalData = {
          token: jwtToken,
          userInfo: user
        }
        return res.json(
          Response(constants.statusCode.ok, constants.usersMsg.loginSucess, finalData)
        );
  
      } else {
        return res.json(
          Response(constants.statusCode.unauth, constants.usersMsg.invalidPass)
        );
      }
    })



  }
})



exports.changePassword = catchAsync(async (req, res) => {
  if (!req.body.oldPassword) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.oldPasswordReq)
    );
  }

  if (!req.body.newPassword) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.newPasswordReq)
    );
  }
  if (!req.body._id) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.idReq)
    );
  }

  let condition = { _id: mongoObjectId(req.body._id) }

  const userUpdate = await Users.findById(condition)

  if (!userUpdate) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.invalidUser)
    );
  }

  const databasePass = userUpdate.password

  const matchPass = utilities.matchPassword(req.body.oldPassword, databasePass)

  //check current password
  if (!matchPass) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.passNotMatch)
    );
  }


  //new pass and old pass are same
  const passMatch = utilities.matchPassword(req.body.newPassword, databasePass)


  if (passMatch) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.samePassword)
    );
  }

  // hash new password
  const newPassword = utilities.saltedPassword(req.body.newPassword)

  const finalData = await commonQuery.updateOneDocument(Users, condition, { password: newPassword })

  if (finalData) {
    return res.json(
      Response(constants.statusCode.ok, constants.usersMsg.passChangeSuccess)
    );
  } else {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.internalservererror)
    );
  }

})

exports.newUser = catchAsync(async (req, res) => {
  let insertObj = {
    email: req.body.email,
    password: req.body.password,
  };

  const alreadyExist = await Users.findOne({email : insertObj.email});
  
  if(alreadyExist) return res.json(
    Response(constants.statusCode.alreadyExist, constants.usersMsg.emailExist)
  );
  
  await usersValidation.validateAsync(insertObj);

  const finalResult = await Users.create(insertObj);

  if (finalResult)
    return res.json(
      Response(constants.statusCode.ok, constants.usersMsg.added)
    );
  else return res.json(internalError());
});



exports.forgetPassword = catchAsync(async (req, res) => {
  if (!req.body.email) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.emailReq)
    );
  }

  const condition = { email: req.body.email }

  const isUser = await Users.findOne(condition)


  if (!isUser) {
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.invalidUser)
    );
  }
  const updateData = {
    resetkey: uuidv4()
  }

  let sendData = {
    resetkey: updateData.resetkey
  }

  const finalData = await commonQuery.updateOneDocument(Users, condition, updateData)

  const resetLink = config.baseUrl + "reset/" + updateData.resetkey;


  const mailOptions = {
    to: req.body.email,
    subject: "Forget password email",
  };
  let printContents = {
    personName: isUser.firstName+" "+isUser.lastName,
    resetLink: resetLink,
  };

  const forgetMail = await mailer.forgotPasswordEmail(mailOptions , printContents )

  if (finalData) {

    return res.json(
      Response(constants.statusCode.ok, constants.usersMsg.linkSent, sendData)
    );
  } else {
    return res.json(
      Response(constants.statusCode.ok, constants.messages.internalservererror)
    )
  }

})

exports.verifyToken = catchAsync(async (req, res) => {

  if (!req.body.token) {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.invalidReq)
    )
  }

  const isExist = await Users.findOne({ resetkey: req.body.token })

  if (!isExist) {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.tokenExp)
    )
  }else{
    return res.json(
      Response(constants.statusCode.ok, constants.messages.tokenSuccess)
    )
  }
})

exports.changeForgetPassword = catchAsync(async(req,res)=>{
  if(!req.body.token) {
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.invalidReq)
    )
  }

  if(!req.body.password){
    return res.json(
      Response(constants.statusCode.unauth, constants.usersMsg.oldPasswordReq
        )
    )
  }
  
  const isExist = await Users.findOne({resetkey : req.body.token})

  if(!isExist){
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.invalidReq
        )
    )
  }

  const newPassword = utilities.saltedPassword(req.body.password)


  // return


  const updateData = await Users.findOneAndUpdate({resetkey:req.body.token},{password : newPassword ,resetkey:null } , { new : true})



  if(updateData){
    return res.json(
      Response(constants.statusCode.ok, constants.messages.passResetSuccess
        )
    )
  }else{
    return res.json(
      Response(constants.statusCode.unauth, constants.messages.internalservererror
        )
    )
  }

})


exports.usersList = catchAsync(async (req, res) => {
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
      { email: new RegExp(searchText, "gi") },
      { date: new RegExp(searchText, "gi") },
      { password: new RegExp(searchText, "gi") },
    ];
  }

  const data = await Users.aggregate([
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "sum" }],
        aggregatedData: [
          {
            $project: {
              id : "$_id",
              email: "$email",
              password: "$password",
              isActive: "$isActive",
              isDeleted: "$isDeleted",
              usersyr: { $dateToString: { format: "%Y", date: "$createdAt" } },
              usersmnt: { $dateToString: { format: "%M", date: "$createdAt" } },
              usersdat: { $dateToString: { format: "%d", date: "$createdAt" } },
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


exports.changeStatus = toggleStatus(Users);

exports.deleteUsers = softDelete(Users);
