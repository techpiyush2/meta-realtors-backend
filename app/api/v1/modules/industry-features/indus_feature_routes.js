const industryFeature = require('./controllers/indus_feature_ctrl')


module.exports = function (router) {

    router.post('/industryFeature/create', industryFeature.addFeature)

    return router
}