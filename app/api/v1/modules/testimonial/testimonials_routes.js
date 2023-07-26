const middlewares = require("../../../../lib/middlewares"),
  Testimonial = require("./controllers/testimonial_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/testimonial/createTestimonial", Testimonial.addTestimonial);
  router.post("/testimonial/update", Testimonial.updateTestimonial);
  router.post("/testimonial/getAllList", Testimonial.testimonialList);
  router.post("/testimonial/detail", Testimonial.testimonialDetails);
  router.post("/testimonial/uploadImage", middlewares.uploadImage);
  router.post("/testimonial/delete", Testimonial.deleteTestimonial);
  router.post("/testimonial/changeStatus", Testimonial.changeStatus);
};
