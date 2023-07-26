const address = require('./controllers/address_ctrl')


module.exports = function( router ){
    router.post('/address/add',address.addAddress);
    router.post('/address/edit',address.editAddress);
    router.post('/address/list',address.addressList);
    router.post('/address/detail',address.details);
    router.post('/address/changeStatus',address.changeStatus);
    router.post('/address/delete',address.deleteAdderss)
}