const Joi = require("joi"),
  constants = require("./constants");

// BLOG
exports.blogValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.blogMsg.titleReq}` }),
  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.blogMsg.type}` }),

  image: Joi.string()
    .required()
    .messages({ "any.required": `${constants.blogMsg.imageReq}` }),

  description: Joi.string()
    .required()
    .messages({ "any.required": `${constants.blogMsg.descReq}` }),
  metaDescription: Joi.string()
    .required()
    .messages({ "any.required": `${constants.blogMsg.metaDescription}` }),
});

//blogCategory
exports.blogCategoryValidation = Joi.object({
  category: Joi.string()
    .required()
    .messages({ "any.required": `${constants.blogMsg.categoryReq}` }),
  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.blogMsg.type}` }),
});

//Contact us
exports.contactusValidation = Joi.object({
  firstName: Joi.string()
    .required()
    .messages({ "any.required": `${constants.contactUsMsg.firstNameReq}` }),
  lastName: Joi.string()
    .required()
    .messages({ "any.required": `${constants.contactUsMsg.lastNameReq}` }),
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": `${constants.contactUsMsg.emailReq}` }),
  contact: Joi.string()
    .required()
    .messages({ "any.required": `${constants.contactUsMsg.contactReq}` }),
  message: Joi.string()
    .required()
    .messages({ "any.required": `${constants.contactUsMsg.messagereq}` }),
});

exports.industriesValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.industriesMsg.titleReq}` }),
  display: Joi.number()
    .required()
    .messages({ "any.required": `${constants.messages.displayOrderReq}` }),

  image: Joi.string()
    .required()
    .messages({ "any.required": `${constants.industriesMsg.imageReq}` }),
  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.industriesMsg.type}` })
});

//Technology
exports.technologyValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.technologyMsg.titleReq}` }),
  display: Joi.number()
    .required()
    .messages({ "any.required": `${constants.messages.displayOrderReq}` }),
  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.technologyMsg.type}` }),
  description: Joi.string()
    .required()
    .messages({ "any.required": `${constants.technologyMsg.descReq}` }),
  image: Joi.string()
    .required()
    .messages({ "any.required": `${constants.technologyMsg.imageReq}` })
});

// services
exports.servicesValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.servicesMsg.titleReq}` }),
  displayOrder: Joi.number()
    .required()
    .messages({ "any.required": `${constants.messages.displayOrderReq}` }),
  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.servicesMsg.type}` }),

  img: Joi.string()
    .required()
    .messages({ "any.required": `${constants.servicesMsg.imageReq}` }),
  shortTitle: Joi.string()
    .required()
    .messages({ "any.required": `${constants.servicesMsg.shortTitle}` }),
  content: Joi.string()
    .required()
    .messages({ "any.required": `${constants.servicesMsg.contentReq}` }),
  technology: Joi.string()
    .required()
    .messages({ "any.required": `${constants.servicesMsg.technologyReq}` }),
});

// skills
exports.skillsValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.skillsMsg.titleReq}` }),

  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.skillsMsg.type}` }),
});

//category
exports.categoryValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.skillsMsg.titleReq}` }),
});

//AboutUs
exports.aboutusValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.aboutusMsg.titleReq}` }),

  description: Joi.string()
    .required()
    .messages({ "any.required": `${constants.aboutusMsg.descReq}` }),
});

exports.usersValidation = Joi.object({
  email: Joi.string()
    .required()
    .messages({ "any.required": `${constants.usersMsg.firstNameReq}` }),

  password: Joi.string()
    .required()
    .messages({ "any.required": `${constants.usersMsg.lastNameReq}` }),
});

//career validation

exports.careerValidation = Joi.object({
  skill: Joi.array()
    .required()
    .messages({ "any.required": `${constants.careerMsg.skillReq}` }),
  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.careerMsg.type}` }),

  description: Joi.string()
    .required()
    .messages({ "any.required": `${constants.careerMsg.descReq}` }),
  job_title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.careerMsg.job_titleReq}` }),
  location: Joi.string()
    .required()
    .messages({ "any.required": `${constants.careerMsg.locationReq}` }),
  jobType: Joi.string()
    .required()
    .messages({ "any.required": `${constants.careerMsg.jobType}` }),

});

exports.careerValidations = Joi.object({
  userName: Joi.array()
    .required()
    .messages({ "any.required": `${constants.usersMsg.userName}` }),
  password: Joi.string()
    .required()
    .messages({ "any.required": `${constants.usersMsg.passwordReq}` }),
  date: Joi.string()
    .required()
    .messages({ "any.required": `${constants.usersMsg.job_titleReq}` }),
  email: Joi.string()
    .required()
    .messages({ "any.required": `${constants.usersMsg.emailReq}` }),
});

exports.applicantValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": `${constants.applicantMsg.userName}` }),
  email: Joi.string()
    .required()
    .messages({ "any.required": `${constants.applicantMsg.emailReq}` }),
  contact: Joi.string()
    .required()
    .messages({ "any.required": `${constants.applicantMsg.contactNumber}` }),
  expInYear: Joi.string()
    .required()
    .messages({ "any.required": `${constants.applicantMsg.expYear}` }),
  expInMonth: Joi.string()
    .required()
    .messages({ "any.required": `${constants.applicantMsg.expMonth}` }),
  file: Joi.string()
    .required()
    .messages({ "any.required": `${constants.applicantMsg.Resume}` }),
  jobId: Joi.string()
    .required()
    .messages({ "any.required": `${constants.applicantMsg.jobIdReq}` })
});


exports.indsFeatureValidation = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `${constants.indusFeatureMsg.title}` }),
  industryId: Joi.string()
    .required()
    .messages({ "any.required": `${constants.indusFeatureMsg.industryIdReq}` }),
});

exports.testimonialValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.nameReq}` }),
  description: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.descReq}` }),
  image: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.image}` }),
  designation: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.desiReq}` }),
    type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.type}` })
});
//userTestimonialValidation
exports.userTestimonialValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.nameReq}` }),
  description: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.descReq}` }),
  image: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.image}` }),
  rating: Joi.number()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.rating}` }),
    type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.type}` }),
    location: Joi.string()
    .required()
    .messages({ "any.required": `${constants.testimonialMsg.location}` }),
});




exports.addressValidation = Joi.object({
  address: Joi.string()
    .required()
    .messages({ "any.required": `${constants.addressMsg.addressReq}` }),
  type: Joi.string()
    .required()
    .messages({ "any.required": `${constants.addressMsg.typeReq}` })
});

