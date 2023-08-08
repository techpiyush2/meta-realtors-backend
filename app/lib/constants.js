// S.A. _id = 5fe6c2910574ba160ca19413

exports.statusCode = {
  ok: 200,
  unauth: 401,
  failed: 1002,
  notFound: 404,
  forbidden: 403,
  validation: 400,
  paymentFail: 402,
  invalidURL: 1001,
  alreadyExist: 409,
  internalError: 1004,
  internalservererror: 500,
};

exports.imageType = ["image/png", "image/jpeg"];
exports.pdfType = "application/pdf";
exports.pdffileType = "file/pdf";
exports.docType =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
exports.oldDocType = "application/msword";
exports.videoType = ["video/mp4", "video/MPEG-2"];
exports.docType =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
exports.oldDocType = "application/msword";
exports.videoType = ["video/mp4", "video/MPEG-2"];
exports.slider_array = ["image/jpeg", "image/png"];

exports.mailSubject = {
  contactUs: "Contact us query",
};

exports.blogMsg = {
  idReq: "Please enter blog id",
  titleReq: "Please enter blog title",
  addSuccess: "Blog added Successfully",
  imageReq: "Please upload image for blog",
  descReq: "Please enter description of blog",
  categoryReq: "Please enter category of blog",
  blogExist: "Blog already exist",
  permalinkReq: "Please enter permalink",
  metatagReq: "Please enter metatag",
  metaDescription: "Please enter meta description",
  type: "Please enter valid type",
};

exports.blogCategoryMsg = {
  idReq: "Please enter blog id",
  addSuccess: "Blog added Successfully",
  categoryReq: "Please enter category of blog",
};

exports.settings = {
  /** Pagination settings */
  count: 10,
  defaultPageNo: 1,
};

exports.directoryPath = {
  BLOG: "../meta-realtors-backend/upload/blogs/",
  // PATH FOR SERVICES
  SERVICES: "../meta-realtors-backend/upload/services/",
  RESUMES: "../meta-realtors-backend/upload/resume/",
  TECHNOLOGY: "../meta-realtors-backend/upload/technology/",
  INDUSTRY: "../meta-realtors-backend/upload/industries/",
  ATTENDENCE: "../meta-realtors-backend/upload/attendence/",
  USER: "../meta-realtors-backend/upload/user/",
  TESTIMONIAL: "../meta-realtors-backend/upload/testimonial/",
  USERTESTIMONIAL: "../meta-realtors-backend/upload/userTestimonial/",
};

exports.cryptoConfig = {
  iv_length: 16,
  secret: "ZimoMain@2021",
  cryptoPassword: "d6F3Efeq",
  cryptoAlgorithm: "aes-128-cbc",
};

exports.messages = {
  uploadSuccess: "Uploaded successfully.",
  imgNotUpload: "Image not uploaded",
  internalservererror: "Internal server error",
  invalidImageFormat: "Only jpeg,png file format are allowed.",
  optionsMissing: "Internal error upload options are missing ",
  successfullyExecuted: "Upload scccessfully",
  atleastMinSize: "Document size should be greater then",
  maxSizeExceeded: "Document size should be less then",
  uploadTypeReq: "Please specify upload type",
  sizeExceeded: "Size should be less then 5mb",
  activated: "Activated successfully",
  deActivated: "De-activated successfully",
  _idReq: "Please enter id",
  isActive: "Please enter current status",
  user_idReq: "Please enter user id",
  ExecutedSuccessfully: "Data fetch Successfully",
  noRecordFound: "No record found",
  updateSuccess: "Data updated successfully",
  imageDeleted: "Image deleted",
  appliedSuccess: "Applied successfully",
  invalidDocFormat: "Only pdf,docx,doc file format are allowed",
  delSuccess: "Deleted successfully",
  addedSuccess: "Data added successfully",
  invalidReq: "Invalid user request",
  tokenExp: "Token expire",
  tokenSuccess: "Token verified successfully",
  uploadImageReq: "Please upload image",
  passResetSuccess: "Password reset successfully",
  displayOrderReq: " Please enter display order",
};

exports.industriesMsg = {
  idReq: "Please enter id",
  titleReq: "Please enter title",
  addSuccess: "Industry added successfully",
  imageReq: "Please upload image",
  contentReq: "Please enter content",
  technologyReq: "Please enter technology",
  exist: "Industry already exist",
  type: "please enter type",
};

exports.doctorDocs = {
  maxSize: "5 mb" /** There must be space between number and type */,
  minSize: "2 kb" /** There must be space between number and type */,
  types: ["image/png", "image/jpg", "application/pdf", "image/jpeg"],
  uploadPath: "../zimo-backend/upload/doctorDocs/",
  typeMsg: "You can upload only jpg, png, pdf",
};
exports.propertyMsg = {
  idReq: "Please enter property id",
  titleReq: "Please enter property title",
  addSuccess: "Property added Successfully",
  exist: "Property already exists",
  imgReq: "Please upload image for property",
  descReq: "Please enter description ",
  bedrooms: "Please enter bedrooms",
  bathrooms: "Please enter bathrooms",
  size: "Please enter size",
  price: "Please enter price",
  parking: "Please select parking",
  parkOrGarden : "Please select Park Or Garden",
  Features: "Please enter Features",
  address: "Please enter address",
  contactNo: "Please enter contactNo",
  ownerName :  "Please enter ownerName",
};


exports.servicesMsg = {
  idReq: "Please enter id",
  titleReq: "Please enter title",
  type: "Please enter type",
  addSuccess: "Services added Successfully",
  imageReq: "Please upload image",
  contentReq: "Please enter content",
  technologyReq: "Please enter technology",
  exist: "service already exist",
  shortTitle: "please enter short title",
};

exports.skillsMsg = {
  idReq: "Please enter Skills id",
  titleReq: "Please enter Skills  title",
  addSuccess: "Skills  added Successfully",
  imageReq: "Please upload image for Skills ",
  descReq: "Please enter description of Skills ",
  exist: "already exist",
  type: "Please enter type",
};

exports.categoryMsg = {
  idReq: "Please enter Skills id",
  titleReq: "Please enter Skills  title",
  addSuccess: "Skills  added Successfully",
  imageReq: "Please upload image for Skills ",
  descReq: "Please enter description of Skills ",
  exist: "already exist",
};

exports.contactUsMsg = {
  idReq: "Please enter contact us id",
  addSuccess: "Query Raised",
  firstNameReq: "First Name is Required",
  lastNameReq: "Last Name is Required",
  emailReq: "Email is Required",
  contactReq: "Mobile Number is Required",
  messagereq: "Please Enter Message",
};

exports.aboutusMsg = {
  idReq: "Please enter Skills id",
  titleReq: "Please enter Skills  title",
  addSuccess: "Skills  added Successfully",
  imageReq: "Please upload image for Skills ",
  descReq: "Please enter description of Skills ",
  exist: "already exist",
};

exports.usersMsg = {
  idReq: "Id is required",
  signUp : "SignUp successfully",
  login : "Login successfully",
  emailReq: "Please enter email",
  emailExist: "Email already exists",
  userName: "Please enter user name",
  passwordReq: "Please enter password",
  usernameReq: "Please enter users title",
  addSuccess: "Users added Successfully",
  addSuccessAdmin: "Admin added Successfully",
  userNotFound: "Cannot find your account",
  imageReq: "Please upload image",
  descReq: "Please enter description of users",
  invalidPass: "Invalid email or password",
  loginSucess: "login successfully",
  otpSent: "OTP send successfully",
  newPasswordReq: "Please enter new password",
  oldPasswordReq: "Please enter password",
  samePassword: "New and old password cannot be same",
  passNotMatch: "Password is incorrect",
  passChangeSuccess: "Password change successfully",
  invalidUser: "Cannot find your account",
  firstNameReq: "please enter firstname",
  lastNameReq: "please enter lastname",
    added : "User Added Successfully",
  pincode: "please enter pincode",
  country: "please enter country",
  state: "please enter state",
  profileUpdateSuccess: "Profile update successfully",
  linkSent: "Reset password link has been sent to your email",
};

exports.applicantMsg = {
  contactNumber: "Please enter contact number",
  expYear: "Please enter year",
  expMonth: "Please enter month",
  Resume: "Please select a file",
  emailReq: "Please enter email",
  userName: "Please enter name",
  jobIdReq: "Job ID is required",
};

exports.careerMsg = {
  idReq: "Please enter career id",
  addSuccess: "Career added Successfully",
  //imageReq: "Please upload image for career",
  descReq: "Please enter description of career",
  job_titleReq: "Please enter job title of career",
  skill: "Please enter skill of career",
  location: "Please enter location of career",
  exist: "already exist",
  locationReq: "Please enter location",
  skillReq: "Please enter skills",
  jobType: "Please enter job type",
  type: "Please enter type",
};

exports.indusFeatureMsg = {
  title: "Please enter title",
  industryIdReq: "Industry ID is required",
};
exports.attendenceMsg = {
  file: "Please select file",
  attendenceSuccess: "File submitted successfully",
  invalidFormat: "Only csv files are allowed",
  employeeIdReq: "Employee id is required",
};
exports.testimonialMsg = {
  nameReq: "Please enter name",
  descReq: "Please enter description",
  image: "Please upload an image",
  testiError: "Failed ! try again",
  idReq: "Please enter testimonial id",
  desiReq: "Please enter designation ",
  testiExist: "Testimonial already exist",
  type: "Please provide type",
  location: "Please Provide location",
  rating: "Please provide rating",
};

exports.addressMsg = {
  addressReq: "please enter address",
  typeReq: "please enter type",
};
