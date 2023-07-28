module.exports = function (express) {
  const router = express.Router();
  require("./modules/aboutus/aboutus_routes")(router);
  require("./modules/blog/blog_routes")(router);
  require("./modules/skills/skills_routes")(router);
  require("./modules/property/property_routes")(router);
  require("./modules/services/services_routes")(router);
  require("./modules/industries/industries_routes")(router);
  require("./modules/category/category_routes")(router);
  require("./modules/users/users_routes")(router);
  require("./modules/career/career_routes")(router);
  require("./modules/contactus/contactus_routes")(router);
  require("./modules/industry-features/indus_feature_routes")(router)
  require("./modules/attendence/attendence_routes")(router)
  require("./modules/testimonial/testimonials_routes")(router);
  require("./modules/address/address_routes")(router);
  require("./modules/userTestimonial/userTestimonial_routes")(router);
  return router;
};