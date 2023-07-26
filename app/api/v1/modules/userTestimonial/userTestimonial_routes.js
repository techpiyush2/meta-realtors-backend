const Testimonials = require("../userTestimonial/controllers/userTestimonial_ctrl");
const middlewares = require("../../../../lib/middlewares");

module.exports = function (router) {
  // CREATE
  router.post("/userTestimonials/create", Testimonials.createUserTestimonials);
  router.post("/userTestimonials/update", Testimonials.updateUserTestimonial);
  router.post("/userTestimonials/list", Testimonials.testimonialList);
  router.post("/userTestimonial/detail", Testimonials.testimonialDetails);
  router.post("/userTestimonials/delete", Testimonials.deleteUserTestimonial);
  router.post("/userTestimonial/changeStatus", Testimonials.changeStatus);
  router.post("/userTestimonial/uploadImage", middlewares.uploadImage);
};
